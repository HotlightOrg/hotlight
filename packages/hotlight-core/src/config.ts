import { Config } from "./typings";

const defaultConfig: Config = {
  isOpen: false,
  initialQuery: "",
  maxHits: 20,
  placeholder: "What do you need?",

  debug: false,
  
  sources: {}
};

export const config = (custom: Partial<Config> = {}): Config => {
  return { ...defaultConfig, ...custom };
}
