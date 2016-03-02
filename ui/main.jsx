
window.$ = window.jQuery = require('jquery');
const Bootstrap = require('bootstrap');

const React = require('react');
const ReactDOM = require('react-dom');

import { Router, Route } from 'react-router';
import { createHistory } from 'history';

let history = createHistory();

var App = require('./components/App');

ReactDOM.render(
  <Router history={history}>
    <Route path="/" component={App}>
    </Route>
  </Router>,
  document.getElementById('main')
);
