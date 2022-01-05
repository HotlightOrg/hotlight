# Hotlight

Spotlight / Albert / Quicksilver but for your website or app. In five minutes.

## Getting started

### React

```bash
npm install hotlight-core
```

### Vanilla JavaScript Web Component

```bash
npm install hotlight-core
```

Add the custom element.

```html
<body>
  ...
  <hotlight-modal></hotlight-modal>
</body>
```

Add the module and configure a source with local actions in it.

If you've installed `hotlight-core` through npm or yarn then `import "hotlight-core"` as shown below. Otherwise you can import it directly from the `unpkg` cdn:

```
<script src="https://unpkg.com/hotlight-core@0.4.3-beta.0/dist/hotlight-core.umd.js"></script>
<script>
...
</script>
```

```js
<script type="module">
import "hotlight-core";

const actions = [
  { title: "Go to a website2", trigger: () => "https://jonas.arnklint.com" },
  { title: "Reload Window", trigger: () => location.reload() },
  { title: "Close Hotlight", trigger: ({ close }) => close() },
  { title: "Home", trigger: "/" },
  { title: "Slow trigger", trigger: async () => await new Promise((resolve) => setTimeout(() => resolve("#slow"), 1000)) },
  { title: "Fast trigger", trigger: () => "#fast" }
]

const source = () => {
  return actions;
}

window
  .customElements
  .whenDefined('hotlight-modal')
  .then(() => {
    const hl = document.querySelector("hotlight-modal");
    hl.sources = [source]; // add one or multiple sources of actions
  });
</script>
```

Notice how actions are defined as an object with a `title` that shows up in the search results and a `trigger` that can either return a URL string, or be voided executing some kind of function in your application.

Code examples and documentation for how to use in React, Vue, Svelte, Angular will be added.

## Develop Hotlight

Contributions are welcome. Please fork this repository, make changes and then create a pull request.

## Publish

Create a pull request to merge with `development`. A beta version will be tagged automatically when the PR is merged.

When a new version should be published, simply create a PR to merge `development` to `main`. This will automatically publish to the [npm registry](https://npmjs.com).
