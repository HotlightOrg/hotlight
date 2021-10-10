import React, { useRef, Suspense, lazy } from "react";
const HotlightLazy = lazy(() => import("./wrapper"));

// this should be in the types in the dist of the component.. import them from there or add a package.json that refers to them
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hotlight-modal': HotlightModal;
    }

    interface HotlightModal {
      config?: any;
      actions?: any;
      //name: string;
    }
  }
}

type Props = {
  config: any;
  actions: any;
}

const Hotlight = ({
  config,
  actions
}: Props) => {

  const modal = useRef(null);
    console.log(modal.current);
    /*
    const c = document.querySelector('hotlight-modal') as JSX.HotlightModal;
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
     */
  console.log(config, actions)

  const ssr = typeof window === "undefined";
  return !ssr ? (
    <>
      <Suspense fallback={<div />}>
        <HotlightLazy config={config} actions={actions} />
      </Suspense>
    </>
  ) : null;
}

export default Hotlight;
