# Hotlight

Spotlight / Albert / Quicksilver but for your website or app. In five minutes.

## Getting started

### React

```bash
npm install @hotlight/react
```

Add the `HotlightProvider` at the app level, or where you normally add providers:

```js
import HotlightProvider from "@hotlight/react";

const MyApp = () => {
  return <HotlightProvider>...</HotlightProvider>;
};
```

`HotlightProvider` enables you to use the `useHotlight` hook which exposes the Hotlight API anywhere in your application.

```js
import { useHotlight } from "@hotlight/react";

const MyComponent = () => {
  const { sources, open } = useHotlight();

  useEffect(() => {
    sources([() => [{ title: "My action", trigger: "https://hotlight.dev" }]]);
  }, []);

  return <button onClick={open}>Open Hotlight</button>;
};
```

The `useHotlight` hook returns an object containing the [API](#api).

### Vanilla JavaScript Web Component

```bash
npm install @hotlight/core
```

Add the custom element.

```html
<body>
  ...
  <hotlight-modal></hotlight-modal>
</body>
```

Add the module and configure a source with local actions in it.

If you've installed `@hotlight/core` through npm or yarn then `import "@hotlight/core"` as shown below. Otherwise you can import it directly from the `unpkg` cdn:

```html
<script src="https://unpkg.com/@hotlight/core@0.4.3-beta.0/dist/hotlight-core.umd.js"></script>
<script>
  ...
</script>
```

```js
<script type="module">
import "@hotlight/core";

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
    hl.sources([source]); // add one or multiple sources of actions
  });
</script>
```

Notice how actions are defined as an object with a `title` that shows up in the search results and a `trigger` that can either return a URL string, or be voided executing some kind of function in your application.

Code examples and documentation for how to use in React, Vue, Svelte, Angular will be added.

## API

Interact with the Hotlight modal through its main API. Depending on what framework you are using, you might interact with Hotlight in different ways.

For instance the `useHotlight` hook exposes the API in a React environment, while you interact directly with the custom element in a "vanilla" setup.

```js
const { query, open, sources } = useHotlight();

useEffect(() => {
  const actions = () => [
    {
      title: "Home",
      trigger: "https://hotlight.dev",
    },
  ];

  sources([actions]);
}, []);
```

In a "vanilla" setup:

```js
const hl = document.querySelector("hotlight-modal");
hl.sources([...]);
```

The common API is available no matter what framework you are in:

### sources(sources: [])

Define one or multiple sources that Hotlight queries for actions. A source can be asynchronous, which enables you to return remotely fetched actions when needed.

A source returns an array of actions.

```js
// synchronous source
const localSource = () => {
  return [
    { title: "Go to hotlight.dev", trigger: () => "https://hotlight.dev" },
    { title: "About", trigger: () => "https://hotlight.dev/about" },
  ];
};
```

A source takes a `query` parameter, if you want to control what actions you want to expose depending on query or the context the user is in.

```js
// return results based on query or current path
const contextAwareSource = (query) => {
  if(query.includes("@docs") || location.pathname.includes("/documentation")) {
    return [...]
  } else {
    return [...]
  }
};
```

Making the source `async` enables fetching remote actions.

```js
// asynchronous source
const remoteSource = async (query) => {
  const res = await fetch(`https://my-domain.com/search?query=${query}`);

  if (res.ok) {
    const { data } = await res.json();
    return data.hits.map((hit) => ({
      title: hit.title,
      trigger: hit.url,
    }));
  } else {
    return [];
  }
};
```

Separating actions into multiple sources enables you to map groups of actions to different contexts.

You can set which sources are used by calling `sources([...])`.

#### Actions

Each action represent a possible hit when a user performs a search. An action has these properties:

- `title` - what is shown in the results. `string`
- `trigger` - a string containing a valid URL or a callback function that is called when the user hits enter or clicks on a hit.
- `alias` - used to match similar or related titles. `optional string[]`

The `trigger` property may return a string with a valid `URL` or a synchronous/asynchronous callback function that then returns `void` or a valid URL.

```js
// sync triggers
const source = [
  {
    title: "Home",
    trigger: "https://hotlight.dev",
  },
  {
    title: "Dark Mode",
    trigger: () => {
      appState.set("darkMode", true);
    },
  },
];
```

The trigger can also be async:

```js
// async trigger
const source = [
  {
    title: "What weather is it today?",
    alias: ["raining", "sunny"],
    trigger: async () => {
      const res = await fetch(
        "https://fcc-weather-api.glitch.me/api/current?lat=35&lon=139"
      );

      if (res.ok) {
        const status = await res.json();
        alert(status.weather[0].description);
      }
    },
  },
];
```

#### Trigger API

The trigger takes an object with a couple of functions to interact with Hotlight.

```js
const close = {
  title: "Close Hotlight",
  trigger: ({ close }) => close(),
};

const clear = {
  title: "Clear Hotlight",
  trigger: ({ clear }) => clear(),
};
```

### query(query: string)

Use `query` to perform a Hotlight search. It simply prefills Hotlight with the query you pass to it. It won't open Hotlight though, so its usually used in combination with `open()`.

### open()

Call `open()` to launch Hotlight programatically when the user clicks on a button for example.

```html
<button id="launch-hotlight">Search</button>
```

```js
const button = document.getElementById("launch-hotlight");
button.addEventListener(() => {
  hl.open();
});
```

### close()

Use `close()` to close Hotlight similarly to and the opposite of `open()`. This is rarely used, as Hotlight takes up the full viewport when opened. The user can always close Hotlight by hitting `ESC`.

## Command Palette Best Practices

- Centralize actions to manage them in one place
- Use alias to assist users in finding what they are looking for

## Develop Hotlight

Contributions are welcome. Please fork this repository, make changes and then create a pull request.

## Publish

Create a pull request to merge with `development`. A beta version will be tagged automatically when the PR is merged.

When a new version should be published, simply create a PR to merge `development` to `main`. This will automatically publish to the [npm registry](https://npmjs.com).
