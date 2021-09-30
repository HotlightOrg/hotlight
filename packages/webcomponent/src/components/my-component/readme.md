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

- [hotlight-modal](../hotlight-modal)

### Graph
```mermaid
graph TD;
  my-component --> hotlight-modal
  hotlight-modal --> hotlight-input
  hotlight-modal --> hotlight-results
  style my-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
