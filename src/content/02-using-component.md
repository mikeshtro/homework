# Using component

We have generated second component for you using command `ng generate component pick-coffee/coffee-overview`.
It generated three component files: HTML, CSS and TypeScript parts of the component. Now use the
generated component inside the main AppComponent. Can you do it on your own?

## Step 1

Import the component TypeScript file into the AppComponent TypeScript file using
`import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component'`.

## Step 2

Use the imported class in the AppComponent's imports using `imports: [CoffeeOverviewComponent]`.

## Step 3

Use the imported component in the AppComponent's HTML template using its selector. It will look like
this `<mcf-coffee-overview></mcf-coffee-overview>`
