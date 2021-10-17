import { Modal } from "./hotlight";
customElements.define("hotlight-modal", Modal);

describe("open", () => {
  let modal;
  beforeEach(() => {
    document.body.innerHTML = "<hotlight-modal></hotlight-modal>";
    modal = document.body.querySelector("hotlight-modal");
  });

  it("opens through a command", () => {
    window.dispatchEvent(new KeyboardEvent("keydown",
      {
        "key": "k",
        "metaKey": true
      }
    ));
    expect(modal.open).toEqual(true);
  });

  it("opens through a method", () => {
    modal.launch();
    expect(modal.open).toEqual(true);
  });

  it("is closed by default", () => {
    expect(modal.open).toEqual(false);
  });
})

describe("this", () => {
  beforeAll(() => {
    document.body.innerHTML = "hey";
  });
  it("does that", () => {
    expect(document.body.innerHTML).toContain("hey");
  });
});
