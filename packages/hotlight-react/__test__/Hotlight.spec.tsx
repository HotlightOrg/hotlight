import React from "react";
import renderer from "react-test-renderer";
import Hotlight from "../src/Hotlight";

const config = {
  sources: [() => [{
    title: "my page",
    trigger: "/",
  }]]
};

test("Passes config and actions down to the web component", () => {
  const component = renderer.create(<Hotlight config={config} />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
