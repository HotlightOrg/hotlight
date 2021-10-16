import React from 'react';
import ReactDOM from 'react-dom';
import Hotlight from '../src/index';

const actions = [
  { title: "Hotlight", trigger: "/" },
  { title: "Readme", trigger: "/" },
  { title: "Test", trigger: "/" },
  { title: "My action", trigger: "/" },
]

ReactDOM.render(React.createElement(Hotlight,{
  config: {},
  actions
}), document.querySelector('#root'));
