export const constants = {
  loading: "loading",
  addItem: "addItem"
}

export default {
  loading(context, payload) {
    context.commit("loading", payload);
  },
  addItem(context, payload) {
    context.commit('addItem', payload);
  },
  clearItem(context, payload) {
    context.commit('clearItem', payload);
  }
};
