import React from "react";
import renderer from "react-test-renderer";
import HotlightProvider from "../src/index";

test("render children", () => {
  const component = renderer.create(
    <HotlightProvider>
      <div>Some div</div>
    </HotlightProvider>
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
