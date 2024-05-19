import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileNode, WebContainer, WebContainerProcess } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { files } from '../utils/files';

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
        <iframe [src]="iframeUrl"></iframe>
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

  private terminalEl = viewChild<ElementRef>('terminal');

  private webcontainerInstance = signal<WebContainer | undefined>(undefined);
  private webcontaierProcess: WebContainerProcess | undefined;

  private terminal = new Terminal({
    convertEol: true,
  });
  private fitAddon = new FitAddon();

  @HostListener('window:resize') resize() {
    this.fitAddon.fit();
    this.webcontaierProcess?.resize({
      cols: this.terminal.cols,
      rows: this.terminal.rows,
    });
  }

  protected iframeUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl('loading.html');

  private setupTerminal = effect(() => {
    const terminalEl = this.terminalEl();
    if (terminalEl != null) {
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.open(terminalEl.nativeElement);

      this.fitAddon.fit();
      this.setupTerminal.destroy();
    }
  });

  private startTerminalShell = effect(() => {
    const webcontainerInstance = this.webcontainerInstance();
    if (webcontainerInstance != null) {
      this.startShell(this.terminal, webcontainerInstance).then((process) => {
        this.webcontaierProcess = process;
      });
      this.startTerminalShell.destroy();
    }
  });

  ngOnInit() {
    WebContainer.boot().then((instance) => {
      instance.on('server-ready', (port, url) => {
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });
      instance.mount(files);
      this.webcontainerInstance.set(instance);
    });
  }

  protected get textAreaValue() {
    return (files['index.js'] as FileNode).file.contents.toString();
  }

  protected setTextAreaValue(e: Event) {
    const webcontainerInstance = this.webcontainerInstance();
    if (webcontainerInstance == null) {
      return;
    }
    this.writeIndexJS(
      (e.currentTarget as HTMLTextAreaElement).value,
      webcontainerInstance
    );
  }

  private async startShell(terminal: Terminal, webContainer: WebContainer) {
    const shellProcess = await webContainer.spawn('jsh', {
      terminal: {
        cols: terminal.cols,
        rows: terminal.rows,
      },
    });
    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminal.write(data);
        },
      })
    );

    const input = shellProcess.input.getWriter();
    terminal.onData((data) => {
      input.write(data);
    });

    return shellProcess;
  }

  private async writeIndexJS(
    content: string,
    webContainer: WebContainer
  ): Promise<void> {
    await webContainer.fs.writeFile('/index.js', content);
  }
}
