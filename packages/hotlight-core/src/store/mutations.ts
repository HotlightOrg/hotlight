import { Actions } from "../typings";

export const loading = (state, payload: boolean) => {
  state.loading = payload;
  return state;
}

export const search = (state, payload: string) => {
  state.query = payload;
  return state;
}

export const activateIndex = (state, index: number) => {
  if (index < state.actions.length && index > -1) {
    state.activeActionIndex = index;
  }
  return state;
}

export const receiveActions = (state, actions: Actions) => {
  if(state.activeActionIndex > actions.length || actions.length === 0) {
    state.activeActionIndex = actions.length - 1;
  } else if(state.activeActionIndex < 0 && actions.length > 0) {
    state.activeActionIndex = 0;
  }
  state.actions = actions;
  return state;
}
