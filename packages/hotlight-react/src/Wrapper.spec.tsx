import React from "react";
import renderer from "react-test-renderer";
import Wrapper from "./Wrapper";

const config = {
};

const actions = [
  { title: "My action", trigger: "https://hotlight.dev" }
];

test("Passes config and actions down to the web component", () => {
  const component = renderer.create(<Wrapper config={config} actions={actions} />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
