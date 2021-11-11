import React, { useEffect } from "react";
import { hotlight } from "hotlight-core";

// this should be in the types in the dist of the component.. import them from there or add a package.json that refers to them
/*
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
*/

type Props = {
  config: any;
  actions: any;
}
const Hotlight = ({ config }: Props) => {
  // Only runs client side
  useEffect(() => {
    const hl = hotlight();
    hl.configure(config);
  })

  return (
    <hotlight-modal />
  )
}
export default Hotlight;
