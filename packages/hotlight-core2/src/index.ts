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
declare module "@hotlight/core" {
  export namespace JSX {
    interface IntrinsicElements {
      "hotlight-modal": LocalJSX.HotlightModal;// & JSXBase.HTMLAttributes<HTMLHotlightModalElement>;
    }
  }
}
*/

/*
import('./components').then(function (maths) {
  console.log(maths);
});
*/

/*
import { defineCustomElements } from "./components";
defineCustomElements();
*/

export const hotlight = () => {
  if(typeof window === "undefined") return;

  import("./components").then((mod) => mod.defineCustomElements());
  //components.defineCustomElements();

  const hotlight = document.querySelector("hotlight-modal")// as Modal;
  console.log(hotlight);
  if(hotlight) return hotlight;
  throw new Error("No <\hotlight-modal\> detected on the page. Please add a <hotlight-modal></hotlight-modal> in the body of the page.");
}

/*
async function renderWidget() {
  const container = document.getElementById("widget");
  if (container !== null) {
    const widget = await import("./widget");
    widget.render(container);
  }
}

renderWidget();
*/
