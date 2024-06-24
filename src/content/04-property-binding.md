# Property binding

Displaying HTML is nice, but we don't really need Angular to do just that. Let's pass some dynamic
values into coffee overview component.

We updated the HTML and CSS part of the component so there is an text field and a button. We would
like to get the ordered coffee count and display it in the text field and increase this count every
time the button is clicked. We don't want to handle manual user input in the text field, we will
come to this later in this course, so for now the text field is disabled.

Let's create a number property called "amount" and a method "orderCoffee", that will increase the
amount by one in the TS part of the component Remember that the properties and methods have to be
`protected` or `public` to be accessible from HTML template.

To pass a value to a property we use property name in square brackets and a value name as a value.
For listening to an event we use event name in round brackets and we call a method that should be
called when the event is emitted.

## Step 1

Create a property called "amount" and a method called "orderCoffee" in the TS part of coffee overview
component

```typescript
export class CoffeeOverviewComponent {
  protected amount = 0;

  protected orderCoffee(): void {
    this.amount += 1;
  }
}
```

## Step 2

Use the property and bind it to the text field input value

`<input type="number" [value]="amount" />`

## Step 3

Bind the click event from the button to the orderCoffee method

`<button (click)="orderCoffee()">Give me more</button>`
