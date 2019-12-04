import React from 'react';
import { Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/App.scss';
import LoginComp from './components/auth/Login.comp';
import DefaultRoute from './routes/DefaultRoute';
import SignUpComp from './components/auth/SignUp.comp';
import './middlewares/axios.mdw';
import ProtectedRoute from './routes/ProtectedRoute';
import StudentRoute from './routes/StudentRoute';
import TeacherRoute from './routes/TeacherRoute';

function App() {
  return (
    <div className='App user-page'>
      <Switch>
        <DefaultRoute path='/login'>
          <LoginComp />
        </DefaultRoute>

        <DefaultRoute path='/sign-up'>
          <SignUpComp />
        </DefaultRoute>

        <ProtectedRoute path='/account'>user</ProtectedRoute>

        <StudentRoute path='/cat/:catName'>
          view category with catName
        </StudentRoute>

        <TeacherRoute path='/t'>teacher</TeacherRoute>

        <StudentRoute exact path='/'>
          student home
        </StudentRoute>

        <DefaultRoute path='*'>no route</DefaultRoute>
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
