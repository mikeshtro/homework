# Baby steps

To start any Angular application you need to install all npm dependencies first. Write `npm install`
into the console. This takes some time. When everything is installed, you can start your application.
Note that in local setup you don't need to reinstall the packages unless package.lock file is changed.

You can start your application by writing `npm run start`. This will build you application and serve
it in development mode. See the changes in the right window.

When you are ready try to update the HTML template part of the component. The application should
display types of coffee to the user. So update generated AppComponent so that it will show three
`span` elements. Each element will represent one type of coffee. The coffee types should be "Espresso",
"Latte" and "Cappuccino".

## Step 1

Update the template property of AppComponent to contain three span elements, each with one coffee
type.

```diff
- template: '<h1>Hello from Angular</h1>',
+ template: `
+   <span>Espresso</span>
+   <span>Latte</span>
+   <span>Cappuccino</span>
+ `,
```
