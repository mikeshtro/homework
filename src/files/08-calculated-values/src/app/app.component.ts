import { Component } from '@angular/core';

import { CoffeeType } from './coffee-type';
import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component';

@Component({
  selector: 'mcf-root',
  standalone: true,
  imports: [CoffeeOverviewComponent],
  template: `
    @for (coffee of coffees; track coffee) {
      <mcf-coffee-overview
        [amount]="orderedCoffees.get(coffee)"
        (amountChange)="orderCoffee($event, coffee)"
      >
        <span class="coffee"> {{ coffee }} </span>
      </mcf-coffee-overview>
    }
  `,
  styles: `
    .coffee {
      color: #12ae12;
    }

    .total {
      font-size: 2rem;
      line-height: 1.75;
    }
  `,
})
export class AppComponent {
  protected readonly coffees: CoffeeType[] = ['espresso', 'latte', 'cappuccino'];

  protected orderedCoffees = new Map<CoffeeType, number>();

  protected orderCoffee(amount: number, id: CoffeeType): void {
    this.orderedCoffees.set(id, amount);
  }
}
