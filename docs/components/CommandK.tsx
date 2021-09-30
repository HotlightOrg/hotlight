import { useEffect, useRef } from "react";
//import { applyPolyfills, defineCustomElements } from "../../packages/webcomponent/loader/index.cjs";
import { defineCustomElements } from "../../packages/webcomponent";
//import { HotlightModal } from "../../packages/webcomponent/dist/types/components";
//import { defineCustomElements as x, MyComponent } from "../../packages/webcomponent/dist/custom-elements";

// this should be in the types in the dist of the component.. import them from there or add a package.json that refers to them
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hotlight-modal': HotlightModal;
    }

    interface HotlightModal {
      config?: any;
      //name: string;
    }
  }
}

type Props = {
  config: any;
}

const CommandK = ({
  config
}: Props) => {
  const c = useRef(null);

  useEffect(() => {
    //import("../../packages/webcomponent/dist/custom-elements")
    defineCustomElements();
  }, [])

  // only run client side...
  useEffect(() => {
    /*
    applyPolyfills().then(() => {
      console.log('polyfil')
    });
     */

    const c = document.querySelector('hotlight-modal') as JSX.HotlightModal;
    if(c) {
      c.config = {
        alwaysOpen: true,
        maxHits: 2,
        ...config
      };

    }
  }, []);

  return (
    <div>
      <hotlight-modal></hotlight-modal>
    </div>
  )
}

export default CommandK;
