import React, { useEffect } from "react";
import { hotlight } from "hotlight-core";

/*
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hotlight-modal': Modal;
    }
  }
}
 */
//declare namespace LocalJSX {
//declare namespace LocalJSX {
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hotlight-modal": HotlightModal;
    }
    interface HotlightModal {
      "configure"?: (config: Partial<{}>) => void;
    }
  }
}
//export { LocalJSX as JSX };
  /*
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hotlight-modal': PersonInfoProps
    }
    interface PersonInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
      config?: Config,
    }
  }
}
  */

// this should be in the types in the dist of the component.. import them from there or add a package.json that refers to them

type Props = {
  config: any;
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
