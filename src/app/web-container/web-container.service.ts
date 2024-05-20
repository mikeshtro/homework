import { Injectable, Signal, signal } from '@angular/core';
import {
  FileSystemTree,
  WebContainer,
  WebContainerProcess,
} from '@webcontainer/api';

@Injectable({ providedIn: 'root' })
export class WebContainerService {
  private state: 'empty' | 'booting' | 'ready' | 'error' = 'empty';
  private processWriter: WritableStreamDefaultWriter<string> | undefined;

  private readonly instance = signal<WebContainer | undefined>(undefined);
  private readonly process = signal<WebContainerProcess | undefined>(undefined);

  readonly serverUrl = signal<string | undefined>(undefined);
  readonly processOutput = signal<string>('');

  async boot(): Promise<void> {
    if (this.state !== 'empty' && this.state !== 'error') {
      return Promise.reject(
        Error('Web container is already booting or booted')
      );
    }

    this.state = 'booting';
    try {
      const instance = await WebContainer.boot();
      instance.on('server-ready', (port, url) => this.serverUrl.set(url));
      this.instance.set(instance);
      this.state = 'ready';
    } catch (error) {
      this.state = 'error';
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
    await this.instance()?.fs.writeFile(file, data);
  }

  writeProcessData(data: string): void {
    this.processWriter?.write(data);
  }

  mount(files: FileSystemTree): void {
    this.instance()?.mount(files);
  }

  resize(cols: number, rows: number): void {
    this.process()?.resize({ cols, rows });
  }
}
