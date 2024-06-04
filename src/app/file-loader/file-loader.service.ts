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
  from,
  OperatorFunction,
} from 'rxjs';

import { WebContainerService } from '../web-container/web-container.service';

@Injectable({ providedIn: 'root' })
export class FileLoaderService {
  private readonly httpClient = inject(HttpClient);
  private readonly webContainerService = inject(WebContainerService);

  private readonly isReady$ = toObservable(this.webContainerService.isReady).pipe(
    filter(isReady => isReady)
  );
  private readonly load$ = new BehaviorSubject('starter');

  readonly files$ = this.load$.pipe(
    delayWhen(() => this.isReady$),
    concatMap(path =>
      this.httpClient
        .get('api/v1/files', { params: { path }, responseType: 'arraybuffer' })
        .pipe(this.processError())
    ),
    concatMap(files => from(this.webContainerService.mount(files)).pipe(this.processError()))
  );

  loadFiles(path: string): void {
    this.load$.next(path);
  }

  private processError<T>(): OperatorFunction<T, T | never> {
    return catchError(error => {
      console.error(error);
      return EMPTY;
    });
  }
}
