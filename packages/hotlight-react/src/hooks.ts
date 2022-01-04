import { HotlightContext } from "./context";
import { useContext } from "react";

export const useHotlight = (initialState = false) => {
  return useContext(HotlightContext);
}
