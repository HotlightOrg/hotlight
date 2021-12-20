import React from 'react';
import ReactDOM from 'react-dom';

import Hotlight from '../src/index';

const actions = [
  { title: "Hotlight", trigger: "/" },
  { title: "Readme", trigger: "/" },
  { title: "Test", trigger: "/" },
  { title: "My action", trigger: "/" },
  { title: "Close Hotlight", trigger: ({ close }) => close() },
  { title: "Slow trigger", trigger: async () => await new Promise((resolve) => setTimeout(() => { alert("done"); resolve("#slow") }, 5000)) },
]

const source = () => actions;

ReactDOM.render(React.createElement(Hotlight, {
  config: {
    sources: [source]
  },
}), document.querySelector('#root'));
