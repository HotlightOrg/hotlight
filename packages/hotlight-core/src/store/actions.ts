import { Actions } from "../typings";
import Store from "./store";

export const constants = {
  loading: "loading",
  activateIndex: "activateIndex",
  search: "search",
  receiveActions: "receiveActions",
}

export const search = (context: Store, payload: string) => {
  context.commit(constants.search, payload);
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
