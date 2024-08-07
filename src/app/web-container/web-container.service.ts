import { computed, Injectable, signal } from '@angular/core';
import { FileSystemTree, WebContainer, WebContainerProcess } from '@webcontainer/api';

@Injectable({ providedIn: 'root' })
export class WebContainerService {
  private processWriter: WritableStreamDefaultWriter<string> | undefined;

  private readonly instance = signal<WebContainer | undefined>(undefined);
  private readonly process = signal<WebContainerProcess | undefined>(undefined);
  private readonly state = signal<'empty' | 'booting' | 'ready' | 'error'>('empty');
  private readonly serverUrl = signal<string | undefined>(undefined);

  readonly isReady = computed(() => this.state() === 'ready');

  readonly url = computed(() => {
    const serverUrl = this.serverUrl();
    if (serverUrl != null && this.state() === 'ready') {
      return serverUrl;
    }

    if (this.state() === 'ready') {
      return 'waiting.html';
    }

    if (this.state() === 'empty' || this.state() === 'booting') {
      return 'loading.html';
    }

    return 'error.html';
  });

  readonly processOutput = signal<string>('');

  async boot(): Promise<void> {
    if (this.state() !== 'empty' && this.state() !== 'error') {
      return Promise.reject(Error('Web container is already booting or booted'));
    }

    this.state.set('booting');
    try {
      const instance = await WebContainer.boot();
      instance.on('server-ready', (port, url) => this.serverUrl.set(url));
      this.instance.set(instance);
      this.state.set('ready');
    } catch (error) {
      this.state.set('error');
      return Promise.reject(error);
    }
  }

  async startShell(): Promise<void> {
    const instance = this.instance();
    if (instance == null) {
      return Promise.reject(Error('Web container is not running'));
    }

    const process = await instance.spawn('jsh');
    const reader = this.processOutput.set;
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          reader(data);
        },
      })
    );
    this.processWriter = process.input.getWriter();
    this.process.set(process);
  }

  async writeFile(file: string, data: string): Promise<void> {
    const instance = this.instance();
    if (instance == null) {
      return Promise.reject('WebContainer instance is not running');
    }

    return instance.fs.writeFile(file, data);
  }

  async readFile(file: string): Promise<string> {
    const instance = this.instance();
    if (instance == null) {
      return Promise.reject('WebContainer instance is not running');
    }

    return instance.fs.readFile(file, 'utf-8');
  }

  writeProcessData(data: string): void {
    this.processWriter?.write(data);
  }

  mount(files: FileSystemTree): Promise<void> {
    const instance = this.instance();
    if (instance == null) {
      return Promise.reject('WebContainer instance is not running');
    }

    return instance.mount(files);
  }

  resize(cols: number, rows: number): void {
    this.process()?.resize({ cols, rows });
  }
}
