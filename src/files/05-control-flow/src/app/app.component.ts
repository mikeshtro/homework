import { Component } from '@angular/core';

import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component';

@Component({
  selector: 'mcf-root',
  standalone: true,
  imports: [CoffeeOverviewComponent],
  template: `
    <mcf-coffee-overview>
      <span class="coffee">Espresso</span>
    </mcf-coffee-overview>

    <mcf-coffee-overview>
      <span class="coffee">Latte</span>
    </mcf-coffee-overview>

    <mcf-coffee-overview>
      <span class="coffee">Cappuccino</span>
    </mcf-coffee-overview>
  `,
  styles: `
    .coffee {
      color: #12ae12;
    }
  `,
})
export class AppComponent {}
