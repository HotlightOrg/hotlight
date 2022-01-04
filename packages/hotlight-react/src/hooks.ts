import { HotlightContext } from "./context";
import { useContext } from "react";

export const useHotlight = () => {
  return useContext(HotlightContext);
}
