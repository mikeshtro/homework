# Inputs and outputs

When components grow you might need to split them into multiple smaller components. Or maybe you
just want to split the component into multiple components to prevent duplication of code. Anyway, you
need a possibility to pass data between between components. For this we can you component inputs and
outputs.

Refactor the application and separate separate the input element and the button from
CoffeeOverviewComponent into new CoffeeInputComponent that was generated for you. Keep the `amount`
property inside the CoffeeOverviewComponent to show the message about ordered coffees. So the new
component should have an input with the same data type, let's call it `value` and an output called
`valueChange`. The value from input will be passed to the input element same way as before and when
the button is clicked, `valueChange` output will emit a value increased by one.

If you follow the convention that the output name is the same as input name just with `Change` suffix,
you can then use two-way "Banana in the box" data binding and bind the `value` property from
CoffeeInputComponent to the `amount` property from the CoffeeOverviewComponent using round brackets
inside square brackets.

## Step 1

Create an input and an output inside CoffeeInputComponent.

```diff
- import { Component } from '@angular/core';
+ import { Component, EventEmitter, Input, Output } from '@angular/core';
```

```diff
- export class CoffeeInputComponent {}
+ export class CoffeeInputComponent {
+   @Input() value: number | undefined;
+
+   @Output() valueChange = new EventEmitter<number>();
+
+   protected orderCoffee(): void {
+     this.valueChange.emit((this.value ?? 0) + 1);
+   }
+ }
```

## Step 2

Copy the input and button from CoffeeOverviewComponent's HTML template to CoffeeInputComponent's
HTML template.

```diff
+ <label class="label">
+   <span>Amount:</span>
+   <input type="number" [value]="value" />
+ </label>
+ <button (click)="orderCoffee()">Give me more</button>
```

## Step 3

Import the CoffeeInputComponent to the coffee overview imports

```diff
- imports: [],
+ imports: [CoffeeInputComponent],
```

and delete the `orderCoffee` method.

```diff
export class CoffeeOverviewComponent {
  protected amount = 0;
-
- protected orderCoffee(): void {
-   this.amount += 1;
- }
}
```

Then use CoffeeInputComponent in CoffeeOverviewComponent's template using its selector instead of
the input and button

```diff
- <label class="label">
-   <span>Amount:</span>
-   <input type="number" [value]="amount" disabled />
- </label>
- <button (click)="orderCoffee()">Give me more</button>
+ <mcf-coffee-input [(value)]="amount" />
```
