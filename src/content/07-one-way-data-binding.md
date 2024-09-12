# One way data binding

Sometimes it is necessary to do more with the value when it changes then just write in into some
property. In these scenarios "Banana in the box" might not be enough and you need to manage the input
and output separately. Just like when handling HTML element properties use square brackets to write
into a component input and round brackets to handle component output. When the output passes a value
you can use `$event` property to pass the value to an event handler.

Morning coffee application now deserves a single source of truth. For now this will be AppComponent.
Move all the information about ordered coffees to that component and then the component will pass the
state to its children.

Create a `Map` inside the AppComponent which will contain `CoffeeType` as key and will store the
number of ordered coffees as a value for each coffee type. Update the CoffeeOverviewComponent so it
will have an `amount` as input and it will just pass it down to the CoffeeInputComponent. Similarly,
when the coffee input component outputs new amount value, the CoffeeOverviewComponent passes it
through its output to AppComponent and this component updates the value in its map.

We need to create input `amount` and output `amountChange` in the CoffeeOverviewComponent and pass
the value from the input down to CoffeeInputComponent. Then listen to the `amountChange` output from
CoffeeInputComponent and pass the value to `amountChange` output in CoffeeOverviewComponent. To
do so break the two way data binding and handle the input and output separately.

Create `orderedCoffees` map in AppComponent, which will hold the ordered coffees, and a method
`orderCoffee` that accepts coffee type and a new value and just replaces the new value in the map.
Then update the HTML template so it passes the right value to each CoffeeOverviewComponent in the for
loop and call the `orderCoffee` method with the correct value and coffee type when
CoffeeOverviewComponent outputs a value.

## Step 1

Create an input and output inside the CoffeeOverviewComponent and a `orderCoffee` method which fires
the output.

```diff
- protected amount = 0;
+ @Input() amount: number | undefined;
+
+ @Output() amountChange = new EventEmitter<number>();
+
+ protected orderCoffee(value: number): void {
+   this.amountChange.emit(value);
+ }
```

## Step 2

Break two way data binding in the CoffeeOverviewComponent's HTML template into one way data binding

```diff
- <mcf-coffee-input [(value)]="amount" />
+ <mcf-coffee-input [value]="amount" (valueChange)="orderCoffee($event)" />
```

Add some null checks to the control flow directives because `amount` can be now undefined;

```diff
- @if (amount > 10) {
+ @if (amount != null && amount > 10) {
    <span class="warning">Don't you think this is too much?</span>
- } @else if (amount > 0) {
+ } @else if (amount != null && amount > 0) {
    <span>You like coffee, he?</span>
  } @else {
    <span>No coffee? 🤔</span>
  }
```

## Step 3

Update AppComponent to hold the map of ordered coffees

```diff
export class AppComponent {
  protected readonly coffees: CoffeeType[] = ['espresso', 'latte', 'cappuccino'];
+
+ protected orderedCoffees = new Map<CoffeeType, number>();
+
+ protected orderCoffee(amount: number, id: CoffeeType): void {
+   this.orderedCoffees.set(id, amount);
+ }
}
```

and update the HTML template to read the values and call the method

```diff
- <mcf-coffee-overview>
-   <span class="coffee"> {{ coffee }} </span>
- </mcf-coffee-overview>
+ <mcf-coffee-overview
+   [amount]="orderedCoffees.get(coffee)"
+   (amountChange)="orderCoffee($event, coffee)"
+ >
+   <span class="coffee"> {{ coffee }} </span>
+ </mcf-coffee-overview>
```
