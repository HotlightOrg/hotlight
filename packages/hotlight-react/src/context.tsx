import React from "react";
import { createContext, useEffect, useState, useRef } from "react";

const HotlightContext = createContext(null);

export const HotlightProvider = ({ children, providedConfig }) => {
  const defaultConfig = {
    hidden: false
  }

  const [currentConfig, setConfig] = useState(
    providedConfig || {}
  );

  const configure = (values) => {
    //setConfig(values);
    if(modal.current) {
      modal.current.configure(values);
    }
  };

  const modal = useRef(null);
  useEffect(() => {
    const load = async () => {
      if(typeof window !== "undefined") {
        await import("hotlight-core");
      }
    }

    load();
  }, []);

  useEffect(() => {
    //React.lazy(() => import('hotlight-core'));

    if(typeof window !== "undefined") {
      //configure Hotlight
      window
        .customElements
        .whenDefined('hotlight-core')
        .then(() => {
          //const hl = document.querySelector("hotlight-core");

          /*
          if(hl) {
            hl.configure(config);
            hl.sources([]);
          }
           */
        });
    }
  }, [modal]);

  const query = (query: string) => {
    if(modal?.current) {
      modal.current.query(query);
    }
  }

  const open = () => {
    modal.current?.open();
  }

  const close = () => {
    modal.current?.close();
  }

  const ensure = (cb) => {
    if(typeof window !== "undefined") {
      window
        .customElements
        .whenDefined('hotlight-core')
        .then(cb);
    }
  }

  //<Hotlight config={currentConfig} />
  return (
    <HotlightContext.Provider
      value={{
        config: currentConfig,
        configure,
        query,
        open,
        close
      }}
    >
      {children}
      <hotlight-modal ref={modal}></hotlight-modal>
    </HotlightContext.Provider>
  );
};

export const HotlightConsumer = HotlightContext.Consumer;

export default HotlightContext;
