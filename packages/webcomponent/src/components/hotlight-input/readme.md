# my-component



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                                                                                                   | Default |
| -------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- | ------- |
| `config` | --        |             | `{ opened?: boolean; stayOpened?: boolean; query?: string; maxHits?: number; sources?: { [name: string]: Source; }; }` | `{}`    |


## Events

| Event            | Description | Type                  |
| ---------------- | ----------- | --------------------- |
| `commandk:close` |             | `CustomEvent<any>`    |
| `commandk:query` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [hotlight-modal](../hotlight-modal)

### Graph
```mermaid
graph TD;
  hotlight-modal --> hotlight-input
  style hotlight-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
