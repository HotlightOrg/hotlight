import { HotlightContext } from "./context";
import { useContext } from "react";

export const useHotlight = () => {
  try {
    return useContext(HotlightContext);
  } catch (e) {
    console.warn("Make sure to add the <HotlightProvider> near the root of this application before using the useHotlight hook.");
    console.warn(e);
  }
}
