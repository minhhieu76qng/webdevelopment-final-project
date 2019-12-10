import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './middlewares/axios.mdw';
import './App.css';
import 'antd/dist/antd.css';
import WrappedLogin from './views/Login';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/login' component={WrappedLogin} />
          <Route path='/admin' render={props => <AdminLayout {...props} />} />
          <Redirect to='/admin/dashboard' />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
