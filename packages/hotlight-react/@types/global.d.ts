import type { DetailedHTMLProps, HTMLAttributes } from "react";

//TODO: Reference the core package output types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hotlight-modal": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "hotlight-hints": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "hotlight-hintszone": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
