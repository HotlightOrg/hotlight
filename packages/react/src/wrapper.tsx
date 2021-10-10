import React from "react";
import { defineCustomElements } from "../../webcomponent";
defineCustomElements();

// this should be in the types in the dist of the component.. import them from there or add a package.json that refers to them
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hotlight-modal': HotlightModal;
    }

    interface HotlightModal {
      config?: any;
      actions?: any;
      ref?: any;
      //name: string;
    }
  }
}

type Props = {
  config: any;
  actions: any;
}
const Wrapper = ({ config, actions }: Props) => {
  //console.log(modal)
  //useEffect(() => {
  //const c = document.querySelector('hotlight-modal') as unknown;
  const c = document.querySelector('hotlight-modal');// as JSX.HotlightModal;
    if(c) {
      c.config = {
        opened: true,
        stayOpened: true,
        maxHits: 2,
        ...config
      };

      c.actions = actions;
      console.log(c)
    }
  //})
  return (
    <hotlight-modal
      config={config}
      actions={actions}
    />
  )
}
export default Wrapper;
