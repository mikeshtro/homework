# Property binding

Displaying HTML is nice, but you don't really need Angular to do just that. Let's pass some dynamic
values into CoffeeOverviewComponent.

HTML and CSS parts of the CoffeeOverviewComponent were updated for you. Now the HTML template contains
a text field and a button. The application should hold an amount of ordered coffees for each
CoffeeOverviewComponent and display it in the text field. It should increase this number every time
the button is clicked. The text field is disabled so you don't have to worry about the user input
so far.

Let's create a number property called `amount` and a method `orderCoffee`, that will increase the
amount by one in the TS part of the component Remember that the properties and methods have to be
`protected` or `public` to be accessible from HTML template.

To pass a value to a property use property name in square brackets and a value name as a value. For
listening to an event use event name in round brackets and call a method that should be called when
the event is emitted.

## Step 1

Create a property called `amount` and a method called `orderCoffee` in CoffeeOverviewComponent

```diff
- export class CoffeeOverviewComponent {}
+ export class CoffeeOverviewComponent {
+   protected amount = 0;
+
+   protected orderCoffee(): void {
+     this.amount += 1;
+   }
+ }
```

## Step 2

Use the property and bind it to the text field input value

```diff
- <input type="number" disabled />
+ <input type="number" [value]="amount" disabled />
```

## Step 3

Bind the click event from the button to the orderCoffee method

```diff
- <button>Give me more</button>
+ <button (click)="orderCoffee()">Give me more</button>
```
