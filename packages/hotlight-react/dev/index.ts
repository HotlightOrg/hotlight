import React, { createElement, useEffect, useState } from 'react';
import { render } from 'react-dom';

import HotlightProvider, { useHotlight, Hints, HintsZone } from '../src/index';

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
    setShow(!show);
  }

  const [show, setShow] = useState(false);

  return createElement("div", {}, [
    createElement(Hints, { key: "hint" }, [
      createElement(HintsZone, { key: "i" }, [
        createElement("input", { key: 1 }),
        createElement("button", { onClick, key: 2 }, show ? "Hide link" : "Show link"),
        createElement("textarea", { key: 3, placeholder: "Textarea..." }),
        createElement("a", { href: "#", key: 4 }, "hey"),
        createElement("a", { href: "#hidden-link", key: 5 }, "hidden link"),
        show ? createElement("div", { key: 12, style: { height: "1000px"} }, [
          createElement("a", { key: "a", href: "https://jonas.arnklint.com", target: "_blank" }, "My Link"),
          createElement("button", { key: "b", onClick: (e) => {
            console.log(e.target, e);
            alert("hidden button");
          }}, "My Link")
        ]) : null
      ]),
    ])
  ]);
}

render(createElement(HotlightProvider, null, [
  createElement(Component, { key: 1 })
]), document.querySelector('#root'));
