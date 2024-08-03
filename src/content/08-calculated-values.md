# Calculated values

Often we need to calculate some a "view-model" from multiple values. There are many ways how to do
it. In the next few steps we will see some of them. We will start with the most simple way, but
beware, this is not a good pattern. We will use it only for illustration to see, how it could be
improved.

We will extend our application so each coffee type will have its price for one coffee. We want to see
for each coffee type the calculated value of ordered coffees and the total price of all ordered
coffees.

Inside the app component we will update the `coffees` property so it will contain array of objects
with two properties: id of type `CoffeeType` and price of type number. We will create two methods.
First method `getPrice` which will accept the coffee id and find, how many coffees of given type
is ordered multiplies it with coffee price. Second method `getTotalPrice` will do the same but for
each coffee type. We will call both methods from HTML template to show the calculated values.

Note that calling methods from HTML template is a bad pattern, it leads to performance issues and
unexpected behavior.

## Step 1

Import the CoffeePrice type to the app component

```typescript
import { CoffeePrice } from './coffee-price';
```

change the coffees property to be array of coffee prices.

```typescript
protected readonly coffees: CoffeePrice[] = [
  { id: 'espresso', price: 12.43 },
  { id: 'latte', price: 22.64 },
  { id: 'cappuccino', price: 24.76 }
];
```

and update the HTML template so it uses coffee type id where previously was just coffee.

```html
@for (coffee of coffees; track coffee.id) {
<mcf-coffee-overview
  [amount]="orderedCoffees.get(coffee.id)"
  (amountChange)="orderCoffee($event, coffee.id)"
>
  <span class="coffee">{{ coffee.id }}</span>
</mcf-coffee-overview>
}
```

## Step 2

Create a getPrice method into a app component which accepts one parameter, coffee ID, finds the
number of ordered coffees with that ID and its price, multiplies the number and returns the result.

```typescript
protected getPrice(id: CoffeeType): number {
  const price = this.coffees.find(x => x.id === id)?.price;
  const amount = this.orderedCoffees.get(id);

  if (price == null || amount == null) {
    return 0;
  }

  return price * amount;
}
```

Then show the result in app component template

```html
@for (coffee of coffees; track coffee.id) {
<mcf-coffee-overview
  [amount]="orderedCoffees.get(coffee.id)"
  (amountChange)="orderCoffee($event, coffee.id)"
>
  <span class="coffee">{{ coffee.id }}</span>
  <span>Price: {{ getPrice(coffee.id) }}</span>
</mcf-coffee-overview>
}
```

## Step 3

Create a getTotalPrice method which will calculate and return the total price of all ordered coffees
of all types in app component.

```typescript
protected getTotalPrice(): number {
  let totalPrice = 0;

  for (const price of this.coffees) {
    const amount = this.orderedCoffees.get(price.id) ?? 0;
    totalPrice += amount * price.price;
  }

  return totalPrice;
}
```

and use it in the HTML template.

```html
<div class="total">Total price: {{ getTotalPrice() }}</div>
<div>
  @for (coffee of coffees; track coffee.id) {
  <mcf-coffee-overview
    [amount]="orderedCoffees.get(coffee.id)"
    (amountChange)="orderCoffee($event, coffee.id)"
  >
    <span class="coffee"> {{ coffee.id }} </span>
    <span>Price: {{ getPrice(coffee.id) }}</span>
  </mcf-coffee-overview>
  }
</div>
```
