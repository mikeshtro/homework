# NgModel

Extend the application so when user writes a number into CoffeeInputComponent's input it will reflect
every user change, ignore negative values and non-valid values. Validations will be described later.
Don't forget to enable the input first.

Use `ngModel` directive from AngularForms module for this functionality. This directive wraps the
logic from HTML form elements and provides easy API for basic form tasks. Update `orderCoffee` method
inside CoffeeInputComponent so that it accepts one parameter representing the new value. Update the
HTML template in CoffeeInputComponent and use `ngModel` directive on the input element, listen to
`ngModelChange` output and call the `orderCoffee` method with whatever the output passes.

## Step 1

Import `FormModule` into coffee input component

```diff
  import { Component, EventEmitter, Input, Output } from '@angular/core';
+ import { FormsModule } from '@angular/forms';
```

```diff
- imports: [],
+ imports: [FormsModule],
```

and use it inside CoffeeInputComponent's HTML template and pass the value property into it.

```diff
- <input type="number" [value]="value" disabled />
+ <input type="number" [ngModel]="value" />
```

## Step 2

Update `orderCoffee` method to accept one parameter

```diff
  protected orderCoffee(value: number): void {
-   this.valueChange.emit((this.value ?? 0) + 1);
+   this.valueChange.emit(value)
  }
```

Then use the method in HTML template to listen for `ngModelChange` output

```diff
- <input type="number" [ngModel]="value" />
+ <input type="number" [ngModel]="value" (ngModelChange)="orderCoffee($event)" />
```

And fix the button calling the method as well

```diff
- <button (click)="orderCoffee()">Give me more</button>
+ <button (click)="orderCoffee((value ?? 0) + 1)">Give me more</button>
```
