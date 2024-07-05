import { Component } from '@angular/core';

import { CoffeeType } from './coffee-type';
import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component';

@Component({
  selector: 'mcf-root',
  standalone: true,
  imports: [CoffeeOverviewComponent],
  template: `
    @for (coffee of coffees; track coffee) {
      <mcf-coffee-overview>
        <span class="coffee"> {{ coffee }} </span>
      </mcf-coffee-overview>
    }
  `,
  styles: `
    .coffee {
      color: #12ae12;
    }
  `,
})
export class AppComponent {
  protected readonly coffees: CoffeeType[] = ['espresso', 'latte', 'cappuccino'];
}
