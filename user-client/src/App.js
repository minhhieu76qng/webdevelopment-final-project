import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/App.scss';
import './middlewares/axios.mdw';
import PageLayout from './layouts/PageLayout';
import AccountLayout from './layouts/AccountLayout';
import ProtectedRoute from './routes/ProtectedRoute';

function App({ fetchAccount }) {
  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);
  return (
    <div className='App user-page'>
      <Switch>
        <ProtectedRoute
          path='/account'
          render={props => <AccountLayout {...props} />}
        />
        <ProtectedRoute
          path='/t'
          render={props => <AccountLayout {...props} />}
        />
        <Route path='/' render={props => <PageLayout {...props} />} />

        <Route path='*' render={props => <div>no route</div>} />
      </Switch>

      <ToastContainer
        position='top-right'
        toastClassName='custom-toast'
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
