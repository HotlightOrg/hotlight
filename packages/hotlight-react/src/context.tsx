import type { ReactNode } from "react";
import React from "react";
import { createContext, useEffect, useState, useRef } from "react";

export const HotlightContext = createContext(null);

const customElement = "hotlight-modal";

type Props = {
  children: ReactNode;
  providedConfig?: any;
};

export const HotlightProvider = ({ children, providedConfig }: Props) => {
  const defaultConfig = {
    hidden: false
  }

  const [currentConfig, setConfig] = useState(
    providedConfig || {}
  );


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

  /* API */
  const configure = (values) => {
    ensure(() => modal?.current.configure(values));
  };

  const query = (query: string) => {
    ensure(() => modal.current.query(query));
  }

  const sources = (_sources: []) => {
    ensure(() => modal.current?.sources(_sources));
  }

  const open = () => {
    ensure(() => modal.current?.open());
  }

  const close = () => {
    ensure(() => modal.current?.close());
  }

  const ensure = (cb) => {
    if(typeof window !== "undefined") {
      if(customElements.get(customElement)) {
        cb();
      } else {
        window
          .customElements
          .whenDefined(customElement)
          .then(() => {
            cb()
          });
      }
    }
  }

  //<Hotlight config={currentConfig} />
  return (
    <HotlightContext.Provider
      value={{
        config: currentConfig,
        configure,
        sources,
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

export default HotlightProvider;
