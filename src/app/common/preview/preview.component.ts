import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  standalone: true,
  template: `<iframe [src]="iframeUrl()"></iframe>`,
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
    this.sanitizer.bypassSecurityTrustResourceUrl(this.url() ?? 'loading.html')
  );
}
