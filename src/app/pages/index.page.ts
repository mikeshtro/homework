import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { FileContent } from '../common/mutli-editor/file-content';
import { MultiEditorComponent } from '../common/mutli-editor/multi-editor.component';
import { PreviewComponent } from '../common/preview/preview.component';
import { TerminalSize } from '../common/terminal/terminal-size';
import { TerminalComponent } from '../common/terminal/terminal.component';
import { FileLoaderService } from '../file-loader/file-loader.service';
import { WebContainerService } from '../web-container/web-container.service';

@Component({
  selector: 'homework-index-page',
  standalone: true,
  template: `
    <div class="instructions">
      <router-outlet />
    </div>
    <div class="ide">
      <div class="code">
        <homework-multi-editor
          [files]="openFiles()"
          (filesChange)="saveEditorValue($event ?? [])"
        />
        <homework-preview #preview [url]="previewUrl()" />
      </div>
      <homework-terminal
        class="terminal"
        [data]="terminalData()"
        (dataChange)="setTerminalData($event)"
        (sizeChange)="resize($event)"
      />
    </div>
  `,
  styles: `
    :host {
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 2fr;
    }

    .instructions {
      border-right: var(--border);
      padding: 2rem;
    }

    .ide {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .code {
      flex: 3;
      display: grid;
      grid-template-columns: 2fr 1fr;
      position: relative;
    }

    .refresh-button {
      position: absolute;
      top: 0;
      right: 0;
    }

    .terminal {
      flex: 2;
    }
  `,
  imports: [RouterOutlet, TerminalComponent, MultiEditorComponent, PreviewComponent],
})
export default class IndexPageComponent implements OnInit {
  private readonly webContainerService = inject(WebContainerService);
  private readonly fileLoaderService = inject(FileLoaderService);

  private readonly files$ = this.fileLoaderService.files$.pipe(takeUntilDestroyed());
  private readonly writeFiles$ = this.fileLoaderService.writeFiles$.pipe(takeUntilDestroyed());

  protected readonly terminalData = this.webContainerService.processOutput;

  protected readonly previewUrl = this.webContainerService.url;

  protected readonly openFiles = signal<FileContent[]>([]);

  constructor() {
    effect(() => this.fileLoaderService.writeFiles(this.openFiles()));
  }

  ngOnInit(): void {
    this.files$.subscribe(files => this.openFiles.set(files));

    this.writeFiles$.subscribe();

    this.webContainerService.boot().then(() => this.webContainerService.startShell());
  }

  protected resize(size: TerminalSize): void {
    this.webContainerService.resize(size.cols, size.rows);
  }

  protected setTerminalData(data: string): void {
    this.webContainerService.writeProcessData(data);
  }

  protected saveEditorValue(openFiles: FileContent[]): void {
    this.openFiles.set(openFiles);
  }
}
