# Custom pipe

Now, when you know what pipes are and how to use them you can go back to the issue in the application
where `getTotalPrice` method is called from HTML template. You can fix it by creating custom pipe.
Pipes similar to components are re-evaluated every time any of the inputs is changed.

Refactor the application and create custom pipe called TotalPricePipe. Move the `getTotalPrice`
method from AppComponent to this new pipe and use the pipe in AppComponent's HTML template instead
of calling the pipe manually. For this purpose empty file total-price.pipe.ts is already created in
the application structure.

## Step 1

Create empty TotalPricePipe and move the content of AppComponent's `getTotalPrice` method to the
pipe's transform method. Both `orderedCoffees` and `coffeePrices` have to be passed as parameters.

```diff
+ import { Pipe, PipeTransform } from '@angular/core';
+
+ import { CoffeeType } from './coffee-type';
+ import { CoffeePrice } from './coffee-price';
+
+ @Pipe({
+   name: 'totalPrice',
+   standalone: true,
+ })
+ export class TotalPricePipe implements PipeTransform {
+   transform(
+     orderedCoffees: Map<CoffeeType, number>,
+     coffeePrices: CoffeePrice[]
+   ): number {
+     let totalPrice = 0;
+
+     for (const price of coffeePrices) {
+       const amount = orderedCoffees.get(price.id) ?? 0;
+       totalPrice += amount * price.price;
+     }
+
+     return totalPrice;
+   }
+ }
```

```diff
- protected getTotalPrice(): number {
-   let totalPrice = 0;
-
-   for (const price of this.coffees) {
-     const amount = this.orderedCoffees.get(price.id) ?? 0;
-     totalPrice += amount * price.price;
-   }
-
-   return totalPrice;
- }
```

## Step 2

Import the pipe to AppComponent and use it in the HTML template.

```diff
  import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component';
+ import { TotalPricePipe } from './total-price.pipe';
```

```diff
- imports: [DecimalPipe, UpperCasePipe, CoffeeOverviewComponent],
+ imports: [UpperCasePipe, DecimalPipe, CoffeeOverviewComponent, TotalPricePipe],
```

```diff
- <div class="total">Total price: {{ getTotalPrice() | number: '1.0-1' }}</div>
+ <div class="total">
+   Total price: {{ orderedCoffees | totalPrice: coffees | number: '1.0-1' }}
+ </div>
```

## Step 3

Did you notice it does not do anything now? As was mentioned previously the pipe is called only when
one of the inputs is changed. Mutating object is not considered as object change so you need to create
new object reference in AppComponent's `orderCoffee` method.

```diff
  protected orderCoffee(amount: number, id: CoffeeType): void {
-   this.orderedCoffees.set(id, amount);
+   const copy = new Map(this.orderedCoffees);
+   copy.set(id, amount);
+   this.orderedCoffees = copy;
  }
```
