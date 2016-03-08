
window.$ = window.jQuery = require('jquery');
const Bootstrap = require('bootstrap');

const React = require('react');
const ReactDOM = require('react-dom');

import { Router, Route } from 'react-router';
import { createHistory } from 'history';

let history = createHistory();

const App = require('./components/App');
const ExploreSection = require('./components/ExploreSection')
const CompareSection = require('./components/CompareSection')

const DefaultRoute = Router.DefaultRoute

ReactDOM.render(
  <Router history={history}>
    <Route component={App}>
      <Route path="/" component={ExploreSection} />
      <Route path="/explore" component={ExploreSection} />
      <Route path="/compare" component={CompareSection} />
    </Route>
  </Router>,
  document.getElementById('main')
);
