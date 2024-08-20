# Custom pipe

Now, when we know what pipes are and how to use them we can go back to the issue in the application
where get total price method is called from HTML template. We can fix it by creating our custom pipe.

Pipes similar to components are re-evaluated every time any of the inputs is changed. We can also
disable this feature by marking the pipe as non-pure, but that is not what we want to do here.

The want to refactor our code and create custom pipe called total price pipe. The get total price
method will be moved from app component to this new pipe and use the pipe in app component HTML
template instead of calling the pipe manually. For this purpose empty file total-price.pipe.ts is
already created in our application structure.

## Step 1

Create empty total price pipe and move the content of app component `getTotalPrice` method to the
pipe's transform method. Both ordered coffees and coffee prices have to be passed as parameters.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

import { CoffeeType } from './coffee-type';
import { CoffeePrice } from './coffee-price';

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
```

## Step 2

Import the pipe to app component and use it in the HTML template. We can delete the original method
from app component as well.

```typescript
import { TotalPricePipe } from './total-price.pipe';

...

@Component({
  ...
  imports: [UpperCasePipe, DecimalPipe, CoffeeOverviewComponent, TotalPricePipe],
  template: `
    ...
    <div class="total">
      Total price: {{ orderedCoffees | totalPrice: coffees | number: '1.0-1' }}
    </div>
  `
})
export class AppComponent {
  ...
}
```

## Step 3

Did you notice it does not do anything now? As we mentioned previously the pipe is called only when
one of the inputs is changed. Mutating object is not considered as object change se we need to create
new object reference in app component's order coffee method.

```typescript
export class AppComponent {
  ...

  protected orderCoffee(amount: number, id: CoffeeType): void {
    const copy = new Map(this.orderedCoffees);
    copy.set(id, amount);
    this.orderedCoffees = copy;
  }
}
```
