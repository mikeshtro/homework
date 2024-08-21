# NgModel

You have probably noticed that when you write some number into coffee input manually without using
order coffee button it will not calculate the price properly. This is because we don't listen for
the input value change yet. So let's fix it now.

We will extend our application so when user writes a number into coffee input it will reflect every
user change. We will ignore negative values. We will do the validations later.

We will use `ngModel` directive from Angular forms module for this. This directive wraps the logic
from HTML form elements and provides easy API for basic form tasks. Inside coffee input component
we will update `orderCoffee` method so that it will accept one parameter representing the new value.
In coffee input component update the HTML template and use `ngModel` directive on the input element,
listen to `ngModelChange` output and call the `orderCoffee` method with whatever the output passes.

## Step 1

Import `FormModule` into coffee input component

```typescript
import { FormsModule } from '@angular/forms';

...

@Component({
  ...
  imports: [FormsModule],
  ...
})
export class CoffeeInputComponent {
  ...
}
```

and use it inside coffee input HTML template and pass the value property into it.

```html
<input type="number" [ngModel]="value" />
```

## Step 2

Update order coffee method to accept one parameter

```typescript
protected orderCoffee(value: number): void {
  this.valueChange.emit(value)
}
```

Then use the method in HTML template to listen for `ngModelChange` output

```html
<input type="number" [ngModel]="value" (ngModelChange)="orderCoffee($event)" />
```

And fix the button calling the method as well

```html
<button (click)="orderCoffee((value ?? 0) + 1)">Give me more</button>
```
