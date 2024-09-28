import { Component, computed, ElementRef, inject, input, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'homework-preview',
  standalone: true,
  template: `
    <span class="header">
      Preview
      <button class="icon-button" (click)="refresh()">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0
            1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306
            9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548
            3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0
            1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </span>
    <iframe #iframe [src]="iframeUrl()"></iframe>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      padding: 0.5rem 1rem;
      background: var(--color-light);
      border-bottom: var(--border);
    }

    .icon-button {
      padding: 0;
      background: none;
      border: none;
      height: 1.5rem;
      width: 1.5rem;
    }

    .icon {
      fill: none;
      stroke: var(--color-dark);
    }

    iframe {
      height: 100%;
      width: 100%;
      border: none;
      border-left: var(--border);
    }
  `,
})
export class PreviewComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly url = input<string>();

  protected readonly iframeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.url() ?? 'about:blank')
  );

  private readonly iframe = viewChild<ElementRef<HTMLIFrameElement>>('iframe');

  protected refresh(): void {
    const iframe = this.iframe()?.nativeElement;
    if (iframe != null) {
      iframe.src = this.url() ?? 'about:blank';
    }
  }
}
