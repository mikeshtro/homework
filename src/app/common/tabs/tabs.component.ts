import { Component, effect, input, model, untracked } from '@angular/core';

@Component({
  selector: 'homework-tabs',
  standalone: true,
  template: `
    @for (file of files(); track file) {
      <button class="active" (click)="openFile.set(file)">{{ file }}</button>
    }
  `,
  styles: ``,
})
export class TabsComponent {
  readonly files = input<string[]>();

  readonly openFile = model<string>();

  constructor() {
    effect(() => {
      const firstFile = this.files()?.at(0);
      untracked(() => this.openFile.set(firstFile));
    });
  }
}
