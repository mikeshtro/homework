import { Component, effect, ElementRef, inject, model } from '@angular/core';
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
      padding: 0.5rem 1rem;
    }
  `,
})
export class EditorComponent {
  private readonly elementRef = inject(ElementRef);

  readonly value = model<string>();

  private readonly view = new EditorView({
    extensions: [
      basicSetup,
      javascript(),
      EditorView.updateListener.of(v => this.value.set(v.view.state.doc.toString())),
    ],
    parent: this.elementRef.nativeElement,
  });

  constructor() {
    effect(() => {
      if (this.view.state.doc.toString() !== this.value()) {
        const transaction = this.view.state.update({
          changes: { from: 0, to: this.view.state.doc.toString().length, insert: this.value() },
        });
        this.view.dispatch(transaction);
      }
    });
  }
}
