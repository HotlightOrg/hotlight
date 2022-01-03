import { Input } from "./input";
import { Results } from "./results";
import { Modal } from "./hotlight";
import { Loading } from "./loading";

export const defineCustomElements = () => {
  customElements.define("hotlight-input", Input);
  customElements.define("hotlight-results", Results);
  customElements.define("hotlight-modal", Modal);
  customElements.define("hotlight-loading", Loading);
}
