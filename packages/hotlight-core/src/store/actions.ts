export const constants = {
  loading: "loading",
  activateIndex: "activateIndex",
  search: "search",
  receiveActions: "receiveActions",
}

export const search = (context, payload) => {
  context.commit(constants.search, payload);
}

export const receiveActions = (context, payload) => {
  context.commit(constants.receiveActions, payload);
}

export const loading = (context, payload) => {
  context.commit(constants.loading, payload);
}

export const activateIndex = (context, payload: number) => {
  context.commit(constants.activateIndex, payload);
}
