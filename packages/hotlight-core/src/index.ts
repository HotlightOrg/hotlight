import { Config } from "./typings";
export type { Config };

declare namespace LocalJSX {
  namespace JSX {
    interface IntrinsicElements {
      "hotlight-modal": HotlightModal;
    }
    interface HotlightModal {
      "configure"?: (config: Partial<Config>) => void;
    }
  }
}

export { LocalJSX as JSX };
declare global {
  namespace JSX {
    interface HotlightModal {
      "configure"?: (config: Partial<Config>) => void;
    }
    interface IntrinsicElements {
      "hotlight-modal": HotlightModal;// & JSXBase.HTMLAttributes<HTMLHotlightModalElement>;
    }
  }
}

/*
declare module "hotlight-core" {
  export namespace JSX {
    interface IntrinsicElements {
      "hotlight-modal": LocalJSX.HotlightModal;// & JSXBase.HTMLAttributes<HTMLHotlightModalElement>;
    }
  }
}
*/

import { Input } from "./input";
customElements.define("hotlight-input", Input);

import { Results } from "./results";
customElements.define("hotlight-results", Results);

import { Modal } from "./hotlight";
customElements.define("hotlight-modal", Modal);

import { Loading } from "./loading";
customElements.define("hotlight-loading", Loading);

export const hotlight = () => {
  const hotlight = document.querySelector("hotlight-modal") as Modal;
  if(hotlight) return hotlight;
  throw new Error("No <\hotlight-modal\> detected on the page. Please add a <hotlight-modal></hotlight-modal> in the body of the page.");
}

//export default hotlight;
