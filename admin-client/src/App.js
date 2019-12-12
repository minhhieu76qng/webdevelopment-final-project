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
import PrivateRoute from './layouts/PrivateRoute';
import NotAllow from './views/NotAllow';

function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/login' component={WrappedLogin} />
          <PrivateRoute
            path='/admin'
            render={props => <AdminLayout {...props} />}
          />
          <PrivateRoute
            path='/unauthorized'
            render={props => <NotAllow {...props} />}
          />
          <Redirect to='/admin/dashboard' />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
