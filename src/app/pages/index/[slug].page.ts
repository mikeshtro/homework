import { injectContent, MarkdownComponent } from '@analogjs/content';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'homework-index-markdown',
  standalone: true,
  template: `
    @if (markdown()) {
      <analog-markdown [content]="markdown()?.content" />
    }
  `,
  imports: [MarkdownComponent],
})
export default class IndexMarkdownPageComponent {
  protected readonly markdown = toSignal(injectContent());
}
