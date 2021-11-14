import React from 'react';
import ReactDOM from 'react-dom';
import Hotlight from '../src/index';

const actions = [
  { title: "Hotlight", trigger: "/" },
  { title: "Readme", trigger: "/" },
  { title: "Test", trigger: "/" },
  { title: "My action", trigger: "/" },
  { title: "Close Hotlight", trigger: ({ close }) => close() },
]

const source = () => actions;

ReactDOM.render(React.createElement(Hotlight,{
  config: {
    sources: [source]
  },
}), document.querySelector('#root'));
