# Using component

Next step in our application would be to wrap the names into a component so that we can not only
display the coffee name but add some common styles and basic logic.

We have generated second component for you using command `ng generate component pick-coffee/coffee-overview`.
It generated three component files: HTML, CSS and TypeScript parts of the component. Now use the
generated component inside the main AppComponent.

## Step 1

Import the component TypeScript file into the AppComponent TypeScript file using
`import { CoffeeOverviewComponent } from './pick-coffee/coffee-overview/coffee-overview.component'`.

## Step 2

Use the imported class in the AppComponent's imports using `imports: [CoffeeOverviewComponent]`.

## Step 3

Use the imported component in the AppComponent's HTML template using its selector. It will contain
the component by using its selector `<mcf-coffee-overview></mcf-coffee-overview>`
