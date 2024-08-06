# ngOnChanges lifecycle hook

As we mentioned previously, our application can now have performance issues and buggy behavior due
to calling methods from templates. We will show some techniques how to achieve the same result more
Angular way.

One of the options is to move the function into some child component and pass all the data as inputs.
Then we can use component lifecycle hook to calculate the total price and store the result into
a property which will then be displayed. We will use `ngOnChanges` lifecycle hook which is called
every time one of the input values is changed.

We want to refactor our application and move move the getPrice method into the coffee overview
component. This time we will make the method private. We need to add one more input to the component
coffee price, so that we have all the data required to calculate the total coffee price. We will
call the getPrice method from ngOnChanges lifecycle hook and store the result into a `computedPrice`
property. We will show this property value in the coffee overview HTML template.

## Step 1

Create a price input in the coffee overview component

```typescript
@Input() price: number | undefined;
```

and move the get price method from app component to the coffee overview component. We have to do
small changes in the method. First we should make it private, then instead of reading the price
and amount values by coffee id read it directly from inputs.

```typescript
private getPrice(): number {
  const price = this.price;
  const amount = this.amount;

  if (price == null || amount == null) {
    return 0;
  }

  return price * amount;
}
```

## Step 2

Create protected property called computedPrice with default value of 0.

```typescript
protected computedPrice = 0;
```

Create public ngOnChanges method in the coffee overview component. Method with this name is
automatically called by Angular every time one of the inputs is changed and change detection cycle
is fired. In this method we will call the getPrice method an assign the result to computedPrice
property.

```typescript
ngOnChanges(): void {
  this.computedPrice = this.getPrice();
}
```

We should also mark the component explicitly that it implements Angular OnChanges interface. Even
though this is not necessary it is a good practice to make the code more readable and a bit safer
from bugs caused by typos.

```typescript
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
...

export class CoffeeOverviewComponent implements OnChanges {
  ...
}
```

## Step 3

Move the element displaying the computed value from app component's HTML template into coffee overview
component's HTML template and show the computedPrice property value.

```html
<span class="coffee">Select me, I am</span>
<span>Price: {{ computedPrice }}</span>
<ng-content />
```

## Step 4

Pass the price of given coffee into the new price input in app component HTML template.

```html
<mcf-coffee-overview
  [price]="coffee.price"
  [amount]="orderedCoffees.get(coffee.id)"
  (amountChange)="orderCoffee($event, coffee.id)"
>
  <span class="coffee"> {{ coffee.id }} </span>
</mcf-coffee-overview>
```
