export const loading = (state, payload: boolean) => {
  state.loading = payload;
  return state;
}

export default {
  loading(state, payload: boolean) {
    state.loading = payload;
    return state;
  },

  addItem(state, payload) {
    state.items.push(payload);

    return state;
  },

  clearItem(state, payload) {
    state.items.splice(payload.index, 1);

    return state;
  }
};
