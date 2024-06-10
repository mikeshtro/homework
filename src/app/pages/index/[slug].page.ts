import {
  ContentFile,
  injectContent,
  injectContentFiles,
  MarkdownComponent,
} from '@analogjs/content';
import { Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { FileLoaderService } from '../../file-loader/file-loader.service';

@Component({
  selector: 'homework-index-slug',
  standalone: true,
  template: `
    <div class="markdown">
      @if (content()) {
        <analog-markdown [content]="content()?.content" />
      }
    </div>
    <div class="links">
      @if (previousLink()) {
        <a [routerLink]="['..', previousLink()]">Previous</a>
      }
      @if (nextLink()) {
        <a [routerLink]="['..', nextLink()]">Next</a>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .markdown {
      flex: 1;
      overflow: auto;
    }

    .links {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  `,
  imports: [RouterLink, MarkdownComponent],
})
export default class IndexSlugPageComponent {
  protected readonly allContents = injectContentFiles<ContentFile>();
  protected readonly content = toSignal(injectContent());
  private readonly fileLoaderService = inject(FileLoaderService);

  readonly slug = input.required<string>();

  private readonly contentIndex = computed(
    () => this.allContents.findIndex(content => content.slug === this.content()?.slug) ?? -1
  );

  protected readonly previousLink = computed(() => {
    if (this.contentIndex() < 1) {
      return undefined;
    }

    return this.allContents.at(this.contentIndex() - 1)?.slug;
  });

  protected readonly nextLink = computed(() => {
    return this.allContents.at(this.contentIndex() + 1)?.slug;
  });

  constructor() {
    effect(() => this.fileLoaderService.loadFiles(this.slug()));
  }
}
