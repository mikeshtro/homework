# Baby steps

To start any Angular application you need to install all npm dependencies first. Write `npm install`
into the console. This takes some time. When everything is installed, you can start your application.
Note that in local setup you don't need to reinstall the packages unless package.lock file is changed.

You can start your application by writing `npm run start`. This will build you application and serve
it in development mode. See the changes in the right window.

When you are ready try to update the HTML template part of the component. Our application will display
types of coffee to the user. So, let's update generated app component it so that it will show three
`span` elements. Each element will represent one type of coffee. We would like to see these three
espresso, latte and cappuccino

## Step 1

Update the template property to this

```
template: `
  <span>Espresso</span>
  <span>Latte</span>
  <span>Cappuccino</span>
`
```
