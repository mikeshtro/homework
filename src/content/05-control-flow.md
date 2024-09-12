# Control flow

Sometimes some simple logic is useful in component's HTML templates. Remember that component templates
should not contain application logic, but some if statements or for loops can be helpful.

Update the application so it displays warning with the text "Don't you think this is too much?" in CoffeeOverviewComponent when the user orders more then 10 coffees. When the user orders at least one
coffee but no more then 10 show message "You like coffee, he?". Otherwise the message should be
"No coffee? 🤔"

Then replace three occurrences of CoffeeOverviewComponent in the AppComponent by a simple for loop.
For this reason CoffeeType string literal type was created for you. Loop array of coffee types in
the HTML template and show the values.

Use `@if`, `@else if`, `@else` and `@for` control flow blocks. Remember that `@for` block requires a
unique track identification. In this case you have a list of unique strings so you can track by its
value.

## Step 1

Update CoffeeOverviewComponent's HTML template and add the messages at the end of the current template

```diff
  <button (click)="orderCoffee()">Give me more</button>
+ @if (amount > 10) {
+   <span class="warning">Don't you think this is too much?</span>
+ } @else if (amount > 0) {
+   <span>You like coffee, he?</span>
+ } @else {
+   <span>No coffee? 🤔</span>
+ }
```

## Step 2

Create an array of coffees in AppComponent's TypeScript part

```diff
- export class AppComponent {}
+ export class AppComponent {
+   protected readonly coffees: CoffeeType[] = ['espresso', 'latte', 'cappuccino'];
}
```

Don't forget to import the `CoffeeType` type.

```diff
import { Component } from '@angular/core';

+ import { CoffeeType } from './coffee-type';
import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component';
```

## Step 3

Use the created array in AppComponent's HTML template and loop in using `@for` block instead of three
separate elements

```diff
- <mcf-coffee-overview>
-   <span class="coffee">Espresso</span>
- </mcf-coffee-overview>
- <mcf-coffee-overview>
-   <span class="coffee">Latte</span>
- </mcf-coffee-overview>
- <mcf-coffee-overview>
-   <span class="coffee">Cappuccino</span>
- </mcf-coffee-overview>
+ @for (coffee of coffees; track coffee) {
+   <mcf-coffee-overview>
+     <span class="coffee"> {{ coffee }} </span>
+   </mcf-coffee-overview>
+ }
```
