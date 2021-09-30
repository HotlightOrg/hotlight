import { useEffect, useRef } from "react";
//import { applyPolyfills, defineCustomElements } from "../../packages/webcomponent/loader/index.cjs";
//import { defineCustomElements } from "../../packages/webcomponent";

// this should be in the types in the dist of the component.. import them from there or add a package.json that refers to them
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'my-component': MyElementAttributes;
    }

    interface MyElementAttributes {
      //name: string;
    }
  }
}

const CommandK = ({
  //config
}) => {
  const c = useRef(null);

  // only run client side...
  useEffect(() => {
    //defineCustomElements();
    /*
    applyPolyfills().then(() => {
      console.log('polyfil')
    });
     */

    /*
    const c = document.querySelector('my-component');
    if(c) {
      c.config = {
        yo: "option",
        ...config
      };
    }
     */
  }, []);

  //<my-component config={{ hey: "o" }}></my-component>
  return (
    <my-component></my-component>
  )
}

export default CommandK;
