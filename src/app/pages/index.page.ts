import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';

import { EditorComponent } from '../common/editor/editor.component';
import { PreviewComponent } from '../common/preview/preview.component';
import { TerminalSize } from '../common/terminal/terminal-size';
import { TerminalComponent } from '../common/terminal/terminal.component';
import { FileLoaderService } from '../file-loader/file-loader.service';
import { WebContainerService } from '../web-container/web-container.service';

@Component({
  selector: 'homework-index-page',
  standalone: true,
  template: `
    <div>
      <router-outlet />
    </div>
    <div class="ide">
      <div class="code">
        <homework-editor [(value)]="editorValue" />
        <homework-preview #preview [url]="previewUrl()" />
        <span>
          <button (click)="saveEditorValue()">Save</button>
        </span>
        <span>
          <button (click)="preview.refresh()">Refresh</button>
        </span>
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
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .instructions {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .markdown {
      flex: 1;
      overflow: auto;
    }

    .links {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .ide {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .code {
      flex: 3;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr auto;
      column-gap: 1rem;
      row-gap: 0.5rem;
    }

    .terminal {
      flex: 2;
    }
  `,
  imports: [RouterOutlet, TerminalComponent, EditorComponent, PreviewComponent],
})
export default class IndexPageComponent implements OnInit {
  private readonly webContainerService = inject(WebContainerService);
  private readonly fileLoaderService = inject(FileLoaderService);

  private readonly files$ = this.fileLoaderService.files$.pipe(takeUntilDestroyed());

  protected readonly terminalData = this.webContainerService.processOutput;

  protected readonly previewUrl = this.webContainerService.url;

  protected editorValue = '';

  ngOnInit(): void {
    this.files$.subscribe(files => {
      console.log(files);
    });

    this.webContainerService.boot().then(() => this.webContainerService.startShell());
  }

  protected resize(size: TerminalSize): void {
    this.webContainerService.resize(size.cols, size.rows);
  }

  protected setTerminalData(data: string): void {
    this.webContainerService.writeProcessData(data);
  }

  protected saveEditorValue(): void {
    this.webContainerService.writeFile('src/app/app.component.ts', this.editorValue);
  }
}
