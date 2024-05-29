import { RouteMeta } from '@analogjs/router';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { EditorComponent } from '../common/editor/editor.component';
import { PreviewComponent } from '../common/preview/preview.component';
import { TerminalSize } from '../common/terminal/terminal-size';
import { TerminalComponent } from '../common/terminal/terminal.component';
import { WebContainerService } from '../web-container/web-container.service';

@Component({
  selector: 'homework-index-page',
  standalone: true,
  template: `
    <div class="instructions">
      <div class="markdown">
        <router-outlet />
      </div>
      <div class="links">
        <a routerLink="first">Next</a>
      </div>
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
  imports: [RouterOutlet, RouterLink, TerminalComponent, EditorComponent, PreviewComponent],
})
export default class IndexPageComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly webContainerService = inject(WebContainerService);

  private readonly files = this.httpClient.get('api/v1/files', {
    responseType: 'arraybuffer',
  });

  protected readonly terminalData = this.webContainerService.processOutput;

  protected readonly previewUrl = this.webContainerService.url;

  protected editorValue = '';

  ngOnInit(): void {
    Promise.all([firstValueFrom(this.files), this.webContainerService.boot()])
      .then(([files]) => this.webContainerService.mount(files))
      .then(() => this.webContainerService.startShell())
      .then(() => this.webContainerService.readFile('src/app/app.component.ts'))
      .then(editorValue => {
        this.editorValue = editorValue;
      });
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
