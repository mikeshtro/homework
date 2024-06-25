# Control flow

We would like to add some simple logic to our HTML templates in our components. Remember that we
should not write application logic to our component HTML templates but some if statements or for
loops can be helpful.

In this step we would like to do two things. First we would like to display warning with the text
"Don't you think this is too much?" in coffee overview component when user orders more then 10
coffees. When the user orders at least one coffee but no more then 10, we would like to show
message "You like coffee, he?". Otherwise the message should be "No coffee? 🤔"

Second we would like to replace three occurrences of coffee overview component in the app component
by a simple for loop. For this reason we created a CoffeeType string literal type. Let's pretend
this is be some data read from API, which will come as array of these types. We would like to loop
this array in the HTML template and show the values.

We will use `@if`, `@else if`, `@else` and `@for` blocks from the Angular control flow feature.
Remember that `@for` block requires a unique track identification. In this case we have a list of
unique strings so we can track by its value.

## Step 1

Update coffee overview component HTML template and add these rows at the end of the current template

```html
@if (amount > 10) {
<span class="warning">Don't you think this is too much?</span>
} @else if (amount > 0) {
<span>You like coffee, he?</span>
} @else {
<span>No coffee? 🤔</span>
}
```

## Step 2

Create an array of coffees in app component TS part

```typescript
protected readonly coffees: CoffeeType[] = ['espresso', 'latte', 'cappuccino'];
```

Don't forget to import the `CoffeeType` type.

```typescript
import { CoffeeType } from './coffee-type';
```

## Step 3

Use the created array in app component HTML template and loop in using `@for` block instead of the
current code

```html
@for (coffee of coffees; track coffee) {
<mcf-coffee-overview>
  <span class="coffee"> {{ coffee }} </span>
</mcf-coffee-overview>
}
```
