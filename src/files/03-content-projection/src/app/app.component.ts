import { Component } from '@angular/core';

import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component';

@Component({
  selector: 'mcf-root',
  standalone: true,
  imports: [CoffeeOverviewComponent],
  template: `
    <span class="coffee">Espresso</span>
    <span class="coffee">Latte</span>
    <span class="coffee">Cappuccino</span>
    <mcf-coffee-overview></mcf-coffee-overview>
  `,
  styles: `
    .coffee {
      color: #12ae12;
    }
  `,
})
export class AppComponent {}
