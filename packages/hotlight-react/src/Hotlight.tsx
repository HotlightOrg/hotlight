import React, { useEffect } from "react";
import { hotlight } from "hotlight-core";

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
