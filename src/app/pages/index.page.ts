import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { forkJoin, from, switchMap } from 'rxjs';

import { EditorComponent } from '../common/editor/editor.component';
import { PreviewComponent } from '../common/preview/preview.component';
import { TerminalSize } from '../common/terminal/terminal-size';
import { TerminalComponent } from '../common/terminal/terminal.component';
import { WebContainerService } from '../web-container/web-container.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container">
      <app-editor
        [value]="editorValue"
        (valueChange)="setEditorValue($event)"
      />
      <app-preview [url]="previewUrl()" />
    </div>
    <app-terminal
      [data]="terminalData()"
      (dataChange)="setTerminalData($event)"
      (sizeChange)="resize($event)"
    />
  `,
  styles: `
    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      height: 100%;
      width: 100%;
    }
  `,
  imports: [TerminalComponent, EditorComponent, PreviewComponent],
})
export default class HomeComponent {
  private readonly httpClient = inject(HttpClient);
  private readonly webContainerService = inject(WebContainerService);

  private readonly files = this.httpClient.get('api/v1/files', {
    responseType: 'arraybuffer',
  });

  protected readonly terminalData = this.webContainerService.processOutput;

  protected readonly previewUrl = this.webContainerService.serverUrl;

  protected editorValue = '';

  ngOnInit() {
    forkJoin([this.files, from(this.webContainerService.boot())])
      .pipe(
        switchMap(([files]) => this.webContainerService.mount(files)),
        switchMap(() => this.webContainerService.startShell()),
        switchMap(() => this.webContainerService.readFile('index.js'))
      )
      .subscribe((indexjs) => {
        this.editorValue = indexjs;
      });
  }

  protected resize(size: TerminalSize) {
    this.webContainerService.resize(size.cols, size.rows);
  }

  protected setTerminalData(data: string) {
    this.webContainerService.writeProcessData(data);
  }

  protected setEditorValue(value: string | undefined) {
    if (value != null) {
      this.webContainerService.writeFile('/index.js', value);
    }
  }
}
