import React from "react";
import type { ReactNode } from "react";

type Props = {
  hotkey?: string;
  children?: ReactNode;
}

export const Hotkey = ({ hotkey, children }: Props) => (
  <hotlight-hotkey data-key={hotkey}>
    {children}
  </hotlight-hotkey>
);

