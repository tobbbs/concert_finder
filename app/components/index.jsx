import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import App from './App/index.jsx';
import confirmationPage from './confirmationPage/index.jsx';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/confirmationPage" component={confirmationPage}></Route>
  </Router>
), document.getElementById('app'));
