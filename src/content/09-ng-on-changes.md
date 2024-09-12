# ngOnChanges lifecycle hook

As was already mentioned, the application can now have performance issues and buggy behavior due
to calling methods from templates. Let's explore some techniques how to achieve the same result more
Angular way.

One of the options is to move the function into some child component and pass all the data as inputs.
Then use component lifecycle hook to calculate the total price and store the result into a property
and display this computed property. Use `ngOnChanges` lifecycle hook which is called every time one
of the input values is changed.

Refactor the application and move move the `getPrice` method into the CoffeeOverviewComponent. This
time will make the method private. Add one more input to the component `price`. Call the `getPrice`
method from `ngOnChanges` lifecycle hook and store the result into a `computedPrice` property. Show
this property value in the CoffeeOverviewComponent's HTML template.

## Step 1

Create a price input in the CoffeeOverviewComponent

```diff
  @Input() amount: number | undefined;
+ @Input() price: number | undefined;
```

and move the `getPrice` method from app component to the CoffeeOverviewComponent. Then make it
private and update it so the method reads price and amount directly from inputs.

```diff
- protected getPrice(id: CoffeeType): number {
-   const price = this.coffees.find(x => x.id === id)?.price;
-   const amount = this.orderedCoffees.get(id);
-
-   if (price == null || amount == null) {
-     return 0;
-   }
-
-   return price * amount;
- }
```

```diff
  protected orderCoffee(value: number): void {
    this.amountChange.emit(value);
  }

+ private getPrice(): number {
+   const price = this.price;
+   const amount = this.amount;
+
+   if (price == null || amount == null) {
+     return 0;
+   }
+
+   return price * amount;
+ }
```

## Step 2

Create protected property called `computedPrice` in CoffeeOverviewComponent with default value of 0.

```diff
  @Output() amountChange = new EventEmitter<number>();

+ protected computedPrice = 0;
```

Create public `ngOnChanges` method in the CoffeeOverviewComponent. Method with this name is
automatically called by Angular every time one of the inputs is changed and change detection cycle
is fired. In this method call the `getPrice` method an assign the result to `computedPrice`
property.

```diff
  protected computedPrice = 0;
+
+ ngOnChanges(): void {
+   this.computedPrice = this.getPrice();
+ }
```

Mark the component explicitly that it implements Angular OnChanges interface. Even though this is not
necessary it is a good practice to make the code more readable and a bit safer from bugs caused by
typos.

```diff
- import { Component, EventEmitter, Input, Output } from '@angular/core';
+ import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
```

```diff
- export class CoffeeOverviewComponent {
+ export class CoffeeOverviewComponent implements OnChanges {
```

## Step 3

Move the element displaying the computed value from AppComponent's HTML template into
CoffeeOverviewComponent's HTML template and show the `computedPrice` property value.

```diff
  <span class="coffee">Select me, I am</span>
+ <span>Price: {{ computedPrice }}</span>
  <ng-content />
```

## Step 4

Pass the price of given coffee into the new price input in AppComponent's HTML template.

```diff
 <mcf-coffee-overview
   [price]="coffee.price"
+  [amount]="orderedCoffees.get(coffee.id)"
   (amountChange)="orderCoffee($event, coffee.id)"
 >
   <span class="coffee"> {{ coffee.id }} </span>
-  <span>Price: {{ getPrice(coffee.id) }}</span>
 </mcf-coffee-overview>
```
