import { Component, computed, ElementRef, inject, input, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'homework-preview',
  standalone: true,
  template: `<iframe #iframe [src]="iframeUrl()"></iframe>`,
  styles: `
    iframe {
      height: 100%;
      width: 100%;
      border-radius: 0.5rem;
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

  refresh(): void {
    const iframe = this.iframe()?.nativeElement;
    if (iframe != null) {
      iframe.src = this.url() ?? 'about:blank';
    }
  }
}
