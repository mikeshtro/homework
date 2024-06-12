import { Component, computed, model } from '@angular/core';

import { EditorComponent } from '../editor/editor.component';
import { TabsComponent } from '../tabs/tabs.component';
import { FileContent } from './file-content';

@Component({
  selector: 'homework-multi-editor',
  standalone: true,
  template: `
    <homework-tabs
      [files]="fileNames()"
      [openFile]="openFile?.fileName"
      (openFileChange)="changeFile($event)"
    />
    <homework-editor [value]="openFile?.content ?? ''" (valueChange)="updateFile($event)" />
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 10rem 1fr;
    }
  `,
  imports: [TabsComponent, EditorComponent],
})
export class MultiEditorComponent {
  readonly files = model<FileContent[]>();

  protected readonly fileNames = computed(() => this.files()?.map(({ fileName }) => fileName));

  protected openFile: FileContent | undefined;

  protected changeFile(fileName: string | undefined): void {
    this.openFile = this.files()?.find(file => file.fileName === fileName);
  }

  protected updateFile(content: string | undefined): void {
    this.files.update(files =>
      files?.map(file =>
        file.fileName === this.openFile?.fileName
          ? { fileName: file.fileName, content: content ?? '' }
          : file
      )
    );
  }
}
