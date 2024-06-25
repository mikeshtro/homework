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
        <a class="link" [routerLink]="['..', previousLink()]">Previous</a>
      }
      @if (nextLink()) {
        <a class="link" [routerLink]="['..', nextLink()]">Next</a>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: auto;
    }

    .markdown {
      flex: 1;
      padding: 2rem 2rem 0 2rem;
    }

    .links {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding: 0 2rem 2rem 2rem;
    }

    .link {
      border: 1px solid var(--color-darker);
      text-decoration: none;
      border-radius: 0.25rem;
      background-color: var(--color-light);
      padding: 0.75rem 2rem;
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
