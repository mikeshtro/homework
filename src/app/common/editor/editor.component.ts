import {
  Component,
  effect,
  ElementRef,
  HostBinding,
  inject,
  model,
  OnDestroy,
  untracked,
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
    }

    ::ng-deep .cm-editor {
      height: 100%;
      max-height: var(--editor-height);
      max-width: var(--editor-width);
    }
  `,
})
export class EditorComponent implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = model<string>();

  @HostBinding('style.--editor-height') editorHeight =
    this.elementRef.nativeElement.getBoundingClientRect().height + 'px';

  @HostBinding('style.--editor-width') editorWidth =
    this.elementRef.nativeElement.getBoundingClientRect().width + 'px';

  private readonly view = new EditorView({
    extensions: [
      basicSetup,
      javascript({ typescript: true }),
      angular(),
      EditorView.updateListener.of(v => {
        const value = this.value();
        if (value !== v.view.state.doc.toString()) {
          untracked(() => this.value.set(v.view.state.doc.toString()));
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
      this.editorWidth = entry.contentRect.width + 'px';
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}
