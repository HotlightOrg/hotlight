import type { ReactNode } from "react";
import type { Sources } from "@hotlight/core";

import React from "react";

import { createContext, useEffect, useState, useRef } from "react";

type ContextProps = {
  sources: (source: Sources) => void;
  open: () => void;
  close: () => void;
  configure: (values: any) => void;
  query: (query: string) => void;
}

export const HotlightContext = createContext<Partial<ContextProps>|null>(null);

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
        await import("@hotlight/core");
      }
    }

    load();
  }, []);

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

  const ensure = (cb: () => void): void => {
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

  return (
    <HotlightContext.Provider
      value={{
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
