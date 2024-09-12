# Calculated values

It is often required to calculate some value from multiple values and then display it in HTML
template. There are many ways how to do it. Let's explore some of them. Let's start with the most
simple way which is calling a method from template. But beware, this is not a good pattern. It is
here only for illustration to see the issues and how it could be improved.

Extend the application so that each coffee type has its price per coffee and display the calculated
value for each coffee type multiplied by the number of ordered coffees. Then display the total price
for all ordered coffees of all types.

Use the `coffees` property inside the AppComponent so it contains array of objects with two
properties: id of type `CoffeeType` and price of type number. Create two methods, first `getPrice`
method, which accepts the coffee ID and finds how many coffees of given type is ordered multiplies
it with coffee price. Second method `getTotalPrice` will do the same but for each coffee type in a
loop. Both methods will be called from HTML template to show the calculated values.

Note that calling methods from HTML template is a bad pattern, it leads to performance issues and
unexpected behavior.

## Step 1

Import the CoffeePrice type to the AppComponent

```diff
+ import { CoffeePrice } from './coffee-price';
  import { CoffeeType } from './coffee-type';
```

change the `coffees` property to be array of coffee prices.

```diff
- protected readonly coffees: CoffeeType[] = ['espresso', 'latte', 'cappuccino'];
+ protected readonly coffees: CoffeePrice[] = [
+   { id: 'espresso', price: 12.43 },
+   { id: 'latte', price: 22.64 },
+   { id: 'cappuccino', price: 24.76 }
+ ];
```

and update the HTML template so it uses coffee type id where previously was just coffee.

```diff
- @for (coffee of coffees; track coffee) {
+ @for (coffee of coffees; track coffee.id) {
    <mcf-coffee-overview
-     [amount]="orderedCoffees.get(coffee)"
-     (amountChange)="orderCoffee($event, coffee)"
+     [amount]="orderedCoffees.get(coffee.id)"
+     (amountChange)="orderCoffee($event, coffee.id)"
    >
-     <span class="coffee"> {{ coffee }} </span>
+     <span class="coffee">{{ coffee.id }}</span>
    </mcf-coffee-overview>
  }
}
```

## Step 2

Create `getPrice` method in the AppComponent which accepts one parameter, coffee ID, finds the
number of ordered coffees with that ID and its price, multiplies the number and returns the result.

```diff
+ protected getPrice(id: CoffeeType): number {
+   const price = this.coffees.find(x => x.id === id)?.price;
+   const amount = this.orderedCoffees.get(id);
+
+   if (price == null || amount == null) {
+     return 0;
+   }
+
+   return price * amount;
+ }
```

Then show the result in AppComponent's template

```diff
  <span class="coffee">{{ coffee.id }}</span>
+ <span>Price: {{ getPrice(coffee.id) }}</span>
```

## Step 3

Create `getTotalPrice` method which will calculate and return the total price of all ordered coffees
of all types in AppComponent.

```diff
+ protected getTotalPrice(): number {
+   let totalPrice = 0;
+
+   for (const price of this.coffees) {
+     const amount = this.orderedCoffees.get(price.id) ?? 0;
+     totalPrice += amount * price.price;
+   }
+
+   return totalPrice;
+ }
```

and use it in the HTML template.

```diff
- @for (coffee of coffees; track coffee.id) {
-   <mcf-coffee-overview
-     [amount]="orderedCoffees.get(coffee.id)"
-     (amountChange)="orderCoffee($event, coffee.id)"
-   >
-     <span class="coffee"> {{ coffee.id }} </span>
-     <span>Price: {{ getPrice(coffee.id) }}</span>
-   </mcf-coffee-overview>
- }
+ <div class="total">Total price: {{ getTotalPrice() }}</div>
+ <div>
+   @for (coffee of coffees; track coffee.id) {
+   <mcf-coffee-overview
+     [amount]="orderedCoffees.get(coffee.id)"
+     (amountChange)="orderCoffee($event, coffee.id)"
+   >
+     <span class="coffee"> {{ coffee.id }} </span>
+     <span>Price: {{ getPrice(coffee.id) }}</span>
+   </mcf-coffee-overview>
+   }
+ </div>
```
