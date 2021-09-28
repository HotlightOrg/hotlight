# my-component



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                                                        | Default     |
| -------- | --------- | ----------- | --------------------------------------------------------------------------- | ----------- |
| `config` | --        |             | `{ launch: string; token?: string; sources: { [name: string]: Source; }; }` | `undefined` |


## Events

| Event           | Description | Type              |
| --------------- | ----------- | ----------------- |
| `commandk:open` |             | `CustomEvent<{}>` |


## Dependencies

### Depends on

- [command-modal](../command-modal)

### Graph
```mermaid
graph TD;
  my-component --> command-modal
  command-modal --> command-input
  command-modal --> command-results
  style my-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
