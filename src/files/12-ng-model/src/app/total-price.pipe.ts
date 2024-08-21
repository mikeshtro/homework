import { Pipe, PipeTransform } from '@angular/core';

import { CoffeePrice } from './coffee-price';
import { CoffeeType } from './coffee-type';

@Pipe({
  name: 'totalPrice',
  standalone: true,
})
export class TotalPricePipe implements PipeTransform {
  transform(
    orderedCoffees: Map<CoffeeType, number>,
    coffeePrices: CoffeePrice[]
  ): number {
    let totalPrice = 0;

    for (const price of coffeePrices) {
      const amount = orderedCoffees.get(price.id) ?? 0;
      totalPrice += amount * price.price;
    }

    return totalPrice;
  }
}
