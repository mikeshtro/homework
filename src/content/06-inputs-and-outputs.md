# Inputs and outputs

When the components grow we might need to split them into multiple smaller components. Or maybe we
just want to split the component into multiple components just to prevent duplication of code.
Anyway, we need a possibility to pass data between between components. For this we can use component
inputs and outputs.

In our morning coffee application we would like to separate the input element and the button,
currently inside coffee overview component, into new coffee input component. We have generated the
component for you it's called coffee-input.component.

We need to keep the `amount` property inside the coffee overview component to show the message about
ordered coffees. So the new component should have an input with the same data type, let's call it
`value` and an output called `valueChange`. The input will be passed to the input element same
way as before and when the button is clicked, `valueChange` output will emit a value increased by
one.

If we follow the convention that the output name is the same as input name just with `Change` suffix,
we can then use two-way "Banana in the box" data binding and bind the `value` property from coffee
input component to the `amount` property from the coffee overview component using round brackets
inside square brackets.

## Step 1

Create an input and an output inside coffee input component.

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mcf-coffee-input',
  standalone: true,
  imports: [],
  templateUrl: './coffee-input.component.html',
  styleUrl: './coffee-input.component.css',
})
export class CoffeeInputComponent {
  @Input() value: number | undefined;

  @Output() valueChange = new EventEmitter<number>();

  protected orderCoffee(): void {
    this.valueChange.emit((this.value ?? 0) + 1);
  }
}
```

## Step 2

Move the input and button from coffee overview component's HTML template to coffee input component's
HTML template.

```html
<label class="label">
  <span>Amount:</span>
  <input type="number" [value]="value" />
</label>
<button (click)="orderCoffee()">Give me more</button>
```

## Step 3

Import the coffee input component to the coffee overview imports

```typescript
imports: [CoffeeInputComponent],
```

and delete the `orderCoffee` method from coffee overview component. Then use it inside its HTML
template using coffee input component's selector

```html
<mcf-coffee-input [(value)]="amount" />
```
