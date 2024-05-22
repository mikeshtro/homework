import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'homework-editor',
  standalone: true,
  template: '<textarea [(ngModel)]="value"></textarea>',
  styles: `
    textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border-radius: 0.5rem;
      background: black;
      color: white;
      padding: 0.5rem 1rem;
    }
  `,
  imports: [FormsModule],
})
export class EditorComponent {
  readonly value = model<string>();
}
