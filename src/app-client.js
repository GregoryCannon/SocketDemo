import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import {BrowserRouter, Route, Router, Switch, Link} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import App from './components/app';
import Home from './components/home';
import Info from './components/info';

const AppClient = (props) => (
  <Router history={createHistory()}>
    <App>
      <Route exact path='/' component={Home}/>
      <Route path='/info' component={Info}/>
    </App>
  </Router>
);

ReactDOM.render(<AppClient />, document.getElementById('root'));
