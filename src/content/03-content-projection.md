# Content projection

We updated AppComponent's and CoffeeOverviewComponent's CSS styles, so you can focus on the angular
part. You can see the changes in AppComponent `styles` property and in coffee-overview.component.css
file.

The next thing we would like to do is to update CoffeeOverview component so that is a card that
wraps whatever is passed into it. We would like to pass the prepared `span` tags to the
CoffeeOverviewComponent like so

```html
<mcf-coffee-overview>
  <span class="coffee">Espresso</span>
</mcf-coffee-overview>
```

To do that we use content projection. In your component you can use `ng-content` element as a
placeholder. This placeholder will be replaced in runtime by child elements passed through HTML.

## Step 1

Update coffee-overview.component.html to look like this

```html
<span class="coffee">Select me, I am</span>

<ng-content />
```

## Step 2

Update app.component.ts template as we have shown in the description. The result should like this

```html
<mcf-coffee-overview>
  <span class="coffee">Espresso</span>
</mcf-coffee-overview>

<mcf-coffee-overview>
  <span class="coffee">Latte</span>
</mcf-coffee-overview>

<mcf-coffee-overview>
  <span class="coffee">Cappuccino</span>
</mcf-coffee-overview>
```
