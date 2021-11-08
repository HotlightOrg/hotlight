import { Actions } from "../typings";

export type State = {
  query: string;
  actions: Actions;
  loading: boolean;
}

const initialState: State = {
  loading: false,
  actions: [],
  query: "",
};

export default initialState;
