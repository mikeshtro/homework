import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileNode } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

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
    <div #terminal class="terminal"></div>
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
})
export default class HomeComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly webContainerService = inject(WebContainerService);

  private terminalEl = viewChild<ElementRef>('terminal');

  private terminal = new Terminal({ convertEol: true });
  private fitAddon = new FitAddon();

  @HostListener('window:resize') resize() {
    this.fitAddon.fit();
    this.webContainerService.resize(this.terminal.cols, this.terminal.rows);
  }

  protected iframeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      this.webContainerService.serverUrl()
    )
  );

  private setupTerminal = effect(() => {
    const terminalEl = this.terminalEl();
    if (terminalEl != null) {
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.open(terminalEl.nativeElement);

      this.webContainerService.onProcessData((data) =>
        this.terminal.write(data)
      );
      this.terminal.onData((data) =>
        this.webContainerService.writeProcessData(data)
      );

      this.resize();
      this.setupTerminal.destroy();
    }
  });

  ngOnInit() {
    this.webContainerService.boot().then(() => {
      this.webContainerService.mount(files);
      this.webContainerService.startShell();
    });
  }

  protected get textAreaValue() {
    return (files['index.js'] as FileNode).file.contents.toString();
  }

  protected setTextAreaValue(e: Event) {
    this.webContainerService.writeFile(
      '/index.js',
      (e.currentTarget as HTMLTextAreaElement).value
    );
  }
}
