import { Config } from "./typings";

const defaultConfig: Config = {
  isOpen: false,
  //stayOpened: false,
  initialQuery: "",
  maxHits: 20,
  placeholder: "What do you need?",

  debug: false,
  
  sources: {}
};

export const config = (custom: Config = {}): Config => {
  return { ...defaultConfig, ...custom };
}
