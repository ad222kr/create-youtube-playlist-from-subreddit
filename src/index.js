import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './styles/index.css';

console.log(process.env.REACT_APP_SECRET)
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
