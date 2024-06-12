import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  defaultIfEmpty,
  delayWhen,
  EMPTY,
  filter,
  forkJoin,
  from,
  map,
  OperatorFunction,
  pipe,
  scan,
  Subject,
  tap,
} from 'rxjs';

import { FileContent } from '../common/mutli-editor/file-content';
import { WebContainerService } from '../web-container/web-container.service';
import { fileDictionary } from './file-dictionary';
import { WithSlug } from './with-slug';

@Injectable({ providedIn: 'root' })
export class FileLoaderService {
  private readonly httpClient = inject(HttpClient);
  private readonly webContainerService = inject(WebContainerService);

  private readonly isReady$ = toObservable(this.webContainerService.isReady).pipe(
    filter(isReady => isReady)
  );
  private readonly load$ = new BehaviorSubject('starter');
  private readonly loadingFiles$ = new Subject<number>();
  private readonly loadingFilesCount$ = this.loadingFiles$.pipe(
    scan((acc, value) => acc + value, 0)
  );

  private readonly writeFilesSubject = new Subject<FileContent[]>();

  readonly isLoading$ = this.loadingFilesCount$.pipe(map(count => count > 0));

  readonly files$ = this.load$.pipe(
    tap(() => this.loadingFiles$.next(1)),
    delayWhen(() => this.isReady$),
    this.getFiles(),
    this.mountFiles(),
    this.readFiles(),
    tap(() => this.loadingFiles$.next(-1))
  );

  readonly writeFiles$ = this.writeFilesSubject.pipe(
    concatMap(files =>
      forkJoin(
        files.map(file =>
          from(this.webContainerService.writeFile(file.fileName, file.content)).pipe(
            this.processError()
          )
        )
      )
    )
  );

  loadFiles(path: string): void {
    this.load$.next(path);
  }

  writeFiles(files: FileContent[]): void {
    this.writeFilesSubject.next(files);
  }

  private getFiles(): OperatorFunction<string, WithSlug<ArrayBuffer>> {
    return concatMap(slug =>
      this.httpClient
        .get('api/v1/files', { params: { path: slug }, responseType: 'arraybuffer' })
        .pipe(this.processError(), this.withSlug(slug))
    );
  }

  private mountFiles(): OperatorFunction<WithSlug<ArrayBuffer>, WithSlug<void>> {
    return concatMap(({ slug, value }) =>
      from(this.webContainerService.mount(value)).pipe(this.processError(), this.withSlug(slug))
    );
  }

  private readFiles(): OperatorFunction<WithSlug, FileContent[]> {
    return concatMap(({ slug }) =>
      forkJoin(
        fileDictionary[slug].map(fileName =>
          from(this.webContainerService.readFile(fileName)).pipe(
            map(content => ({ fileName, content }))
          )
        )
      ).pipe(defaultIfEmpty([]), this.processError())
    );
  }

  private withSlug<T>(slug: string): OperatorFunction<T, WithSlug<T>> {
    return pipe(map(value => ({ slug, value })));
  }

  private processError<T>(): OperatorFunction<T, T | never> {
    return catchError(error => {
      console.error(error);
      this.loadingFiles$.next(-1);
      return EMPTY;
    });
  }
}
