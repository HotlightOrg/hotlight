import { Actions, Config, State } from "../typings";

export const setConfig = (state: State, payload: Partial<Config>) => {
  state.config = {
    ...state.config,
    ...payload
  }

  return state;
}

export const loading = (state: State, payload: boolean) => {
  state.loading = payload;
  return state;
}

export const search = (state: State, payload: string) => {
  state.query = payload;
  return state;
}

export const activateIndex = (state: State, index: number) => {
  if (index < state.actions.length && index > -1) {
    state.activeActionIndex = index;
  }
  return state;
}

export const receiveActions = (state: State, actions: Actions) => {
  if(state.activeActionIndex > actions.length || actions.length === 0) {
    state.activeActionIndex = actions.length - 1;
  } else if(state.activeActionIndex < 0 && actions.length > 0) {
    state.activeActionIndex = 0;
  }
  state.actions = actions;
  return state;
}
