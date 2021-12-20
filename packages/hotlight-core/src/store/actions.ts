import { Actions, Config } from "../typings";
import Store from "./store";

export const constants = {
  setConfig: "setConfig",
  loading: "loading",
  activateIndex: "activateIndex",
  search: "search",
  setTheme: "setTheme",
  receiveActions: "receiveActions",
  clear: "clear",
}

export const clear = (context: Store, payload: string) => {
  context.commit(constants.clear, payload);
}

export const setConfig = (context: Store, payload: Partial<Config>) => {
  context.commit(constants.setConfig, payload);
}

export const search = (context: Store, payload: string) => {
  context.commit(constants.search, payload);
}

export const setTheme = (context: Store, payload: "dark" | "light") => {
  context.commit(constants.setTheme, payload);
}

export const receiveActions = (context: Store, payload: Actions) => {
  context.commit(constants.receiveActions, payload);
}

export const loading = (context: Store, payload: boolean) => {
  context.commit(constants.loading, payload);
}

export const activateIndex = (context: Store, payload: number) => {
  context.commit(constants.activateIndex, payload);
}
