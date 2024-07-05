# One way data binding

Sometimes we want to do more with the value when it changes then just write in into some property.
In these scenarios "banana in the box" might not be enough and we need to manage our input and
output separately. Just like when handling HTML element properties we use square brackets to write
into a component input and round brackets to handle component output. When the output passes a value
we can use `$event` property to pass the value to the event handler.

Our morning coffee application now deserves a single source of truth. For now this would be app
component. We would like to move all the information about ordered coffees to that component and
this component will pass the state to its children.

Inside the app component we will create a `Map` which will contain `CoffeeType` as key and will store
the number of ordered coffees as a value for each coffee type. We will update the coffee overview
component so it will have an `amount` as input and it will just pass it down to the coffee input
component. Similarly, when the coffee input component outputs new amount value, the coffee overview
component will pass it through its output to app component and this component will update the value
in its map.

We need to create an input `amount` and output `amountChange` in the coffee overview and pass the
value from the input down to coffee input component and listen to the `amountChange` output from
coffee input component and pass the value to `amountChange` output in coffee overview component. To
do so we need to break the two way data binding and handle the input and output separately.

We need to create `orderedCoffees` map in app component, which will hold the ordered coffees, and a
method `orderCoffee` which will accept coffee type and a new value and will just replace the new
value in the map. Then update the HTML template so it will pass the right value to each coffee overview
component in the for loop and call the `orderCoffee` method with the correct value and coffee type
when coffee overview component outputs a value.

## Step 1

Create an input and output inside the coffee overview component and a `orderCoffee` method which will
just fire the output.

```typescript
@Input() amount: number | undefined;

@Output() amountChange = new EventEmitter<number>();

protected orderCoffee(value: number): void {
  this.amountChange.emit(value);
}
```

## Step 2

Break two way data binding inside the coffee overview HTML template into o one way data binding

```html
<mcf-coffee-input [value]="amount" (valueChange)="orderCoffee($event)" />
```

Because `amount` may be undefined, we need to add some null checks as well to the control flow
directives

```html
@if (amount != null && amount > 10) {
<span class="warning">Don't you think this is too much?</span>
} @else if (amount != null && amount > 0) {
<span>You like coffee, he?</span>
} @else {
<span>No coffee? 🤔</span>
}
```

## Step 3

Update app component to hold the map of ordered coffees

```typescript
protected orderedCoffees = new Map<CoffeeType, number>();

protected orderCoffee(amount: number, id: CoffeeType): void {
  this.orderedCoffees.set(id, amount);
}
```

and update the HTML template to read the values and call the method

```html
<mcf-coffee-overview
  [amount]="orderedCoffees.get(coffee)"
  (amountChange)="orderCoffee($event, coffee)"
>
  <span class="coffee"> {{ coffee }} </span>
</mcf-coffee-overview>
```
