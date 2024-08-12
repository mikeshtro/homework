# Common pipes

We still have one more problematic method call from template in our app component, the getTotalPrice
method. But before we refactor that, let's step aside for a while and talk about pipes from Angular
common package.

We want to make two small changes in our application. First in our app component we want to change
the visualization of the coffee ID. We want to display it in capital letters.

The second change we want to change will be in app component and coffee overview component. In both
components we show some prices. You might notice that some numbers are not rounded correctly. We
decided that one decimal place is good enough and so we want all these numbers round to one decimal
place.

For both changes we will use pipes from Angular common package. For the first change we will use
upper case pipe without any additional parameter and for the second update we will use decimal pipe
with one additional parameter that defines number of decimal places.

## Step 1

Import upper case pipe into the app component and use it in the HTML template using its name

```typescript
import { UpperCasePipe } from '@angular/common';

...

@Component({
  ...
  imports: [UpperCasePipe, CoffeeOverviewComponent],
  template: `
    ...
          <span class="coffee"> {{ coffee.id | uppercase }} </span>
    ...
  `,
  styles: `...`,
})
export class AppComponent {
...
}
```

## Step 2

Import decimal pipe into app component and use it in the HTML template using its name with second
parameter defining that we want to round the number to one decimal place.

```typescript
import { DecimalPipe } from '@angular/common';

@Component({
  ...
  imports: [UpperCasePipe, DecimalPipe, CoffeeOverviewComponent],
  template: `
    <div class="total">Total price: {{ getTotalPrice() | number: '1.0-1' }}</div>
    ...
  `,
  styles: `...`,
})
export class AppComponent {
  ...
}
```

Do the same for coffee overview component

```typescript
import { DecimalPipe } from '@angular/common';

@Component({
  ...
  imports: [DecimalPipe, CoffeeInputComponent],
  ...
})
export class CoffeeOverviewComponent implements OnChanges {
  ...
}
```

and the HTML template

```html
<span class="coffee">Select me, I am</span>
<span>Price {{ computedPrice | number: '1.0-1' }}</span>
...
```
