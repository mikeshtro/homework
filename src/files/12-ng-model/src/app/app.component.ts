import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { CoffeePrice } from './coffee-price';
import { CoffeeType } from './coffee-type';
import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component';
import { TotalPricePipe } from './total-price.pipe';

@Component({
  selector: 'mcf-root',
  standalone: true,
  imports: [DecimalPipe, UpperCasePipe, CoffeeOverviewComponent, TotalPricePipe],
  template: `
    <div class="total">
      Total price: {{ orderedCoffees | totalPrice: coffees | number: '1.0-1' }}
    </div>
    <div>
      @for (coffee of coffees; track coffee.id) {
        <mcf-coffee-overview
          [price]="coffee.price"
          [amount]="orderedCoffees.get(coffee.id)"
          (amountChange)="orderCoffee($event, coffee.id)"
        >
          <span class="coffee"> {{ coffee.id | uppercase }} </span>
        </mcf-coffee-overview>
      }
    </div>
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
  protected readonly coffees: CoffeePrice[] = [
    { id: 'espresso', price: 12.43 },
    { id: 'latte', price: 22.64 },
    { id: 'cappuccino', price: 24.76 },
  ];

  protected orderedCoffees = new Map<CoffeeType, number>();

  protected orderCoffee(amount: number, id: CoffeeType): void {
    const copy = new Map(this.orderedCoffees);
    copy.set(id, amount);
    this.orderedCoffees = copy;
  }
}
