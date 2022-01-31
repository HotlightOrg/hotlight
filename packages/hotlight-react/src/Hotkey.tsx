import React from "react";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
}

export const Hints = ({ children }: Props) => (
  <hotlight-hints>
    {children}
  </hotlight-hints>
)

export const HintsZone = ({ children }: Props) => (
  <hotlight-hintszone>
    {children}
  </hotlight-hintszone>
)
