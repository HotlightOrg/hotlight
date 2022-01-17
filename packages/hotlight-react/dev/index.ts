import React, { createElement, useEffect, useState } from 'react';
import { render } from 'react-dom';

import HotlightProvider, { useHotlight, Hotkey } from '../src/index';

const actions = [
  { title: "Hotlight", trigger: "/" },
  { title: "Readme", trigger: "/" },
  { title: "Test", trigger: "/" },
  { title: "My action", trigger: "/" },
  { title: "Close Hotlight", trigger: ({ close }) => close() },
  { title: "Slow trigger", trigger: async () => await new Promise((resolve) => setTimeout(() => { alert("done"); resolve("#slow") }, 5000)) },
  { title: "Fast trigger", trigger: async () => "#fast" },
]

const remoteActions = [
  { title: "Installing Hotlight", trigger: "/" },
  { title: "Getting started", trigger: () => "/" },
]

const source = () => actions;
const remote = async (query) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      return resolve(remoteActions);
    }, 250 * Math.random());
  });
}

const Component = () => {
  const { open, close, sources } = useHotlight();

  useEffect(() => {
    sources([source, remote]);
    open();

    setTimeout(() => {
      close();
    }, 1000);
  }, []);

  const onClick = () => {
    alert("Toggling hidden elements...");
    setShow(!show);
  }

  const [show, setShow] = useState(false);

  return createElement("div", {}, [
    createElement(Hotkey, { key: "i", hotkey: "i" }, createElement("input")),
    createElement(Hotkey, { key: "b", hotkey: "b" }, createElement("button", { onClick }, show ? "Hide link" : "Show link")),
    createElement(Hotkey, { key: "c", hotkey: "t" }, createElement("textarea", { placeholder: "Textarea..." })),
    createElement(Hotkey, { key: "d", hotkey: "a" }, createElement("a", { href: "#" }, "hey")),
    createElement("div", {}, show ? [
      createElement(Hotkey, { key: "e", hotkey: "v" }, createElement("a", { href: "#hidden-link" }, "hidden link")),
    ] : null)
  ]);
}

render(createElement(HotlightProvider, null, [
  createElement(Component, { key: 1 })
]), document.querySelector('#root'));
