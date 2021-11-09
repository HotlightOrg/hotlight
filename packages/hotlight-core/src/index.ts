import { Input } from "./input";
customElements.define("hotlight-input", Input);

import { Results } from "./results";
customElements.define("hotlight-results", Results);

import { Modal } from "./hotlight";
customElements.define("hotlight-modal", Modal);

import { Loading } from "./loading";
customElements.define("hotlight-loading", Loading);

export const hotlight = () => {
  const hotlight = document.querySelector("hotlight-modal");
  if(hotlight) return hotlight;
  throw new Error("No <hotlight-modal> detected on the page. Please add a <hotlight-modal></hotlight-modal> in the body of the page.");
}
