import { Component } from '@angular/core';

@Component({
  selector: 'mcf-root',
  standalone: true,
  imports: [],
  template: '<h1>Hello from Angular</h1>',
  styles: `
    h1 {
      color: red;
    }
  `,
})
export class AppComponent {}
