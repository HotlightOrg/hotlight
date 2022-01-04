/*
import React, { useEffect } from "react";
import { Config } from "hotlight-core";
//import { hotlight, Config } from "hotlight-core";



// this should be in the types in the dist of the component.. import them from there or add a package.json that refers to them

type Props = {
  config: Config;
}
const Hotlight = ({ config }: Props) => {
  // Only runs client side
  useEffect(() => {
    const init = async () => {
      const mod = await import("hotlight-core");

      const hl = mod.hotlight();
      hl.configure(config);
    }

    init();
  }, [])

  return (
    <hotlight-modal />
  )
}
export default Hotlight;
*/

//import type { HotlightModal } from "hotlight-core";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hotlight-modal": any;//HotlightModal;
    }
      /*
    interface HotlightModal {
      "configure"?: (config: Partial<Config>) => void;
    }
       */
  }
}

import React, { useEffect, useRef } from "react";
import { useHotlight } from "./hooks";

const Hotlight = ({ config }) => {
  const modal = useRef(null);
  if(typeof window !== "undefined") {
    window.r2 = React;
    window.r3 = "yo";
  }
  const actions = [
    { title: "Go to a website2", trigger: () => "https://jonas.arnklint.com" },
    { title: "Reload Window", trigger: () => location.reload() },
    //{ title: "Close Hotlight", trigger: ({ close }) => close() },
    { title: "Home", trigger: "/" },
    { title: "Slow trigger", trigger: async () => await new Promise((resolve) => setTimeout(() => resolve("#slow"), 1000)) },
    { title: "Fast trigger", trigger: () => "#fast" }
  ]

  const source = () => {
    return actions;
  }

  const { config, configure } = useHotlight();
  console.log(config, "from component");
  //const value = useContext(HotlightContext);
  //console.log(value);

  useEffect(() => {
    const load = async () => {
      if(typeof window !== "undefined") {
        await import("hotlight-core");
      }
    }

    load();
    console.log(modal);
    //React.lazy(() => import('hotlight-core'));

    if(typeof window !== "undefined") {
      //configure Hotlight
      window.customElements.whenDefined('hotlight-core').then(() => {
        const hl = document.querySelector("hotlight-core");

        if(hl) {
          hl.configure(config);
          hl.sources([]);
        }
      });
    }
  }, [config]);

  return (
    <hotlight-modal ref={modal}></hotlight-modal>
  );

}

export default Hotlight;

