# Common pipes

The application still has one more problematic method call from template in AppComponent, the
`getTotalPrice` method. But before you refactor that, let's step aside for a while and talk about
pipes from Angular common package.

The next step in the application requires two small changes. First change the visualization of the
coffee ID in the AppComponent to be displayed in capital letters. The second change is to round coffee prices to one decimal place in AppComponent and
CoffeeOverviewComponent.

Use pipes from Angular common package for both changes. For the first change use UpperCasePipe
without any additional parameter and for the second update we use DecimalPipe with one additional
parameter that defines number of decimal places.

## Step 1

Import UpperCasePipe into the AppComponent and use it in the HTML template using its name

```diff
  import { Component } from '@angular/core';
+ import { UpperCasePipe } from '@angular/common';
```

```diff
- imports: [CoffeeOverviewComponent],
+ imports: [UpperCasePipe, CoffeeOverviewComponent],
```

```diff
- <span class="coffee"> {{ coffee.id }} </span>
+ <span class="coffee"> {{ coffee.id | uppercase }} </span>
```

## Step 2

Import DecimalPipe into AppComponent and use it in the HTML template using its name with second
parameter defining that we want to round the number to one decimal place.

```diff
- import { UpperCasePipe } from '@angular/common';
+ import { DecimalPipe, UpperCasePipe } from '@angular/common';
```

```diff
- imports: [UpperCasePipe, CoffeeOverviewComponent],
+ imports: [UpperCasePipe, DecimalPipe, CoffeeOverviewComponent],
```

```diff
- <div class="total">Total price: {{ getTotalPrice() }}</div>
+ <div class="total">Total price: {{ getTotalPrice() | number: '1.0-1' }}</div>
```

Do the same for CoffeeOverviewComponent

```diff
  import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
+ import { DecimalPipe } from '@angular/common';
```

```diff
- imports: [CoffeeInputComponent],
+ imports: [DecimalPipe, CoffeeInputComponent],
```

and the HTML template

```diff
- <span>Price: {{ computedPrice }}</span>
+ <span>Price {{ computedPrice | number: '1.0-1' }}</span>
```
