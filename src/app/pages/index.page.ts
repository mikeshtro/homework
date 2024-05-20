import { Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileNode } from '@webcontainer/api';

import { TerminalSize } from '../common/terminal-size';
import { TerminalComponent } from '../common/terminal.component';
import { files } from '../utils/files';
import { WebContainerService } from '../web-container/web-container.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container">
      <div class="editor">
        <textarea [value]="textAreaValue" (input)="setTextAreaValue($event)">
I am a textarea</textarea
        >
      </div>
      <div class="preview">
        <iframe [src]="iframeUrl()"></iframe>
      </div>
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

    textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border-radius: 0.5rem;
      background: black;
      color: white;
      padding: 0.5rem 1rem;
    }

    iframe {
      height: 100%;
      width: 100%;
      border-radius: 0.5rem;
    }
  `,
  imports: [TerminalComponent],
})
export default class HomeComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly webContainerService = inject(WebContainerService);

  protected terminalData = this.webContainerService.processOutput;

  protected iframeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      this.webContainerService.serverUrl()
    )
  );

  protected get textAreaValue() {
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

  protected setTextAreaValue(e: Event) {
    this.webContainerService.writeFile(
      '/index.js',
      (e.currentTarget as HTMLTextAreaElement).value
    );
  }
}
