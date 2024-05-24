import {
  Component,
  effect,
  ElementRef,
  HostBinding,
  inject,
  model,
  OnDestroy,
} from '@angular/core';
import { angular } from '@codemirror/lang-angular';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';

@Component({
  selector: 'homework-editor',
  standalone: true,
  template: '',
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.5rem;
      border: 1px solid black;
    }

    ::ng-deep .cm-editor {
      max-height: var(--editor-height);
    }
  `,
})
export class EditorComponent implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = model<string>();

  @HostBinding('style.--editor-height') editorHeight =
    this.elementRef.nativeElement.getBoundingClientRect().height + 'px';

  private readonly view = new EditorView({
    extensions: [
      basicSetup,
      javascript(),
      angular(),
      EditorView.updateListener.of(v => {
        if (this.value() !== v.view.state.doc.toString()) {
          this.value.set(v.view.state.doc.toString());
        }
      }),
    ],
    parent: this.elementRef.nativeElement,
  });

  private resizeObserver: ResizeObserver;

  constructor() {
    effect(() => {
      if (this.view.state.doc.toString() !== this.value()) {
        const transaction = this.view.state.update({
          changes: { from: 0, to: this.view.state.doc.toString().length, insert: this.value() },
        });
        this.view.dispatch(transaction);
      }
    });

    this.resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry == null) {
        return;
      }
      this.editorHeight = entry.contentRect.height + 'px';
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}
