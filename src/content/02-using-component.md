# Using component

Next step in the application is to wrap the coffee type names into a component so that you can not
only display the coffee type but add some styles and basic logic to it.

Second component was already generated for you using command

```shell
ng generate component pick-coffee/coffee-overview
```

It generated three component files: HTML, CSS
and TypeScript parts of the component. Now import the generated component into the app component
and use it in its HTML template without any additional changes

## Step 1

Import the component TypeScript file into the AppComponent TypeScript file

```diff
+ import {
+  CoffeeOverviewComponent
+ } from './pick-coffee/coffee-overview/coffee-overview.component;'
```

## Step 2

Use the imported class in the AppComponent's imports

```diff
- imports: [],
+ imports: [CoffeeOverviewComponent],
```

## Step 3

Use the imported component in the AppComponent's HTML template using its selector. It will contain
the component by using its selector

```diff
template: `
  <span class="coffee">Espresso</span>
  <span class="coffee">Latte</span>
  <span class="coffee">Cappuccino</span>
+ <mcf-coffee-overview></mcf-coffee-overview>
`
```
