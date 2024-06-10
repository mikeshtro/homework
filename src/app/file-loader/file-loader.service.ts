import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  concatMap,
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

import { WebContainerService } from '../web-container/web-container.service';
import { fileDictionary } from './file-dictionary';

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

  readonly isLoading$ = this.loadingFilesCount$.pipe(map(count => count > 0));

  readonly files$ = this.load$.pipe(
    tap(() => this.loadingFiles$.next(1)),
    delayWhen(() => this.isReady$),
    this.getFiles(),
    this.mountFiles(),
    this.readFiles(),
    tap(() => this.loadingFiles$.next(-1))
  );

  loadFiles(path: string): void {
    this.load$.next(path);
  }

  readFile(path: string | undefined): Promise<string> {
    if (path == null) {
      return Promise.reject();
    }

    return this.webContainerService.readFile(path);
  }

  private getFiles(): OperatorFunction<string, { slug: string; value: ArrayBuffer }> {
    return concatMap(slug =>
      this.httpClient
        .get('api/v1/files', { params: { path: slug }, responseType: 'arraybuffer' })
        .pipe(this.processError(), this.withSlug(slug))
    );
  }

  private mountFiles(): OperatorFunction<
    { slug: string; value: ArrayBuffer },
    { slug: string; value: void }
  > {
    return concatMap(({ slug, value }) =>
      from(this.webContainerService.mount(value)).pipe(this.processError(), this.withSlug(slug))
    );
  }

  private readFiles(): OperatorFunction<{ slug: string }, { fileName: string; content: string }[]> {
    return concatMap(({ slug }) =>
      forkJoin(
        fileDictionary[slug].map(fileName =>
          from(this.readFile(fileName)).pipe(map(content => ({ fileName, content })))
        )
      ).pipe(this.processError())
    );
  }

  private withSlug<T>(slug: string): OperatorFunction<T, { slug: string; value: T }> {
    return pipe(
      map(value => ({ slug, value })),
      tap(e => console.log(e))
    );
  }

  private processError<T>(): OperatorFunction<T, T | never> {
    return catchError(error => {
      console.error(error);
      this.loadingFiles$.next(-1);
      return EMPTY;
    });
  }
}
