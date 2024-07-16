import { Component, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { DirectoryNode, FileNode, FileSystemTree } from '@webcontainer/api';
import { map, OperatorFunction, share } from 'rxjs';

import { FileContent } from '../common/mutli-editor/file-content';
import { MultiEditorComponent } from '../common/mutli-editor/multi-editor.component';
import { PreviewComponent } from '../common/preview/preview.component';
import { TerminalSize } from '../common/terminal/terminal-size';
import { TerminalComponent } from '../common/terminal/terminal.component';
import { fileDictionary } from '../file-loader/file-dictionary';
import { FileLoaderService } from '../file-loader/file-loader.service';
import { WithSlug } from '../file-loader/with-slug';
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
      overflow: hidden;
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

  private readonly files = toSignal(this.fileLoaderService.files$);

  protected readonly terminalData = this.webContainerService.processOutput;

  protected readonly previewUrl = this.webContainerService.url;

  protected readonly openFiles = signal<FileContent[]>([]);

  constructor() {
    effect(() => {
      const openFiles = this.openFiles();
      const isReady = untracked(() => this.webContainerService.isReady());
      if (isReady) {
        openFiles.map(file => this.webContainerService.writeFile(file.fileName, file.content));
      }
    });

    effect(async () => {
      const files = this.files();
      if (files == null) {
        return;
      }
      const fileContents = this.mapFiles(files);
      untracked(() => this.openFiles.set(fileContents));
      if (this.webContainerService.isReady()) {
        await this.webContainerService.mount(files.value);
        const openFiles = untracked(() => this.openFiles());
        openFiles.map(file => this.webContainerService.writeFile(file.fileName, file.content));
      }
    });
  }

  ngOnInit(): void {
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

  private mapFiles(tree: WithSlug<FileSystemTree>): FileContent[] {
    const result: FileContent[] = [];

    for (const fileName of fileDictionary[tree.slug] ?? []) {
      const path = fileName.split('/');
      const content = this.getFileContent(path, tree.value);
      if (content != null) {
        result.push({ fileName, content });
      }
    }

    return result;
  }

  private getFileContent(filePath: string[], tree: FileSystemTree): string | undefined {
    const firstPath = filePath[0];
    if (filePath.length > 1) {
      if (!this.isFileNode(tree[firstPath])) {
        return this.getFileContent(filePath.slice(1), tree[firstPath].directory);
      } else {
        return undefined;
      }
    } else {
      if (this.isFileNode(tree[firstPath])) {
        return tree[firstPath].file.contents.toString();
      } else {
        return undefined;
      }
    }
  }

  private isFileNode(node: DirectoryNode | FileNode): node is FileNode {
    return Object.prototype.hasOwnProperty.call(node, 'file');
  }
}
