import { Component, inject } from '@angular/core';
import { FileNode } from '@webcontainer/api';

import { EditorComponent } from '../common/editor/editor.component';
import { PreviewComponent } from '../common/preview/preview.component';
import { TerminalSize } from '../common/terminal/terminal-size';
import { TerminalComponent } from '../common/terminal/terminal.component';
import { files } from '../utils/files';
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
  private readonly webContainerService = inject(WebContainerService);

  protected readonly terminalData = this.webContainerService.processOutput;

  protected readonly previewUrl = this.webContainerService.serverUrl;

  protected get editorValue() {
    return (files['index.js'] as FileNode).file.contents.toString();
  }

  ngOnInit() {
    this.webContainerService.boot().then(() => {
      this.webContainerService.mount(files);
      this.webContainerService.startShell();
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
