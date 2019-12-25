import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faIdBadge,
  faEnvelope,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import Home from './views/Home';
import TeacherDetail from './views/TeacherDetail';
import LoginContainer from './containers/LoginContainer';
import SignUp from './views/SignUp';
import ProfileContainer from './containers/ProfileContainer';
import TeacherList from './views/TeacherList';

const routes = {
  student: [
    {
      path: '/login',
      name: 'Login',
      component: LoginContainer,
      layout: '',
    },
    {
      path: '/sign-up',
      name: 'Sign Up',
      component: SignUp,
      layout: '',
    },
    {
      path: '/categories/:catId',
      name: 'Categories',
      component: TeacherList,
      layout: '',
    },
    {
      path: '/teachers/:teacherId',
      name: 'Detail',
      component: TeacherDetail,
      layout: '',
    },
    {
      path: '/',
      exact: true,
      name: 'Home',
      component: Home,
      layout: '',
    },
    {
      path: '*',
      name: 'Home',
      component: () => <div>no route</div>,
      layout: '',
    },
    // account
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileContainer,
      layout: '/account',
    },
    {
      path: '/messages',
      name: 'Message',
      component: () => <div>messages</div>,
      layout: '/account',
    },
    {
      path: '/',
      name: 'Home',
      redirectPath: '/account/profile',
      layout: '/account',
    },
  ],
  teacher: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => <div>dashboard</div>,
      layout: '/t',
      icon: <FontAwesomeIcon icon={faChartBar} />,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileContainer,
      layout: '/t',
      icon: <FontAwesomeIcon icon={faIdBadge} />,
    },
    {
      path: '/messages',
      name: 'Messages',
      component: () => <div>messages</div>,
      layout: '/t',
      icon: <FontAwesomeIcon icon={faEnvelope} />,
    },
    {
      path: '/contracts',
      name: 'Contracts',
      component: () => <div>contracts</div>,
      layout: '/t',
      icon: <FontAwesomeIcon icon={faAddressCard} />,
    },
    {
      exact: true,
      path: '/',
      name: 'Home',
      redirectPath: '/t/dashboard',
      layout: '/t',
    },
  ],
};

export default routes;
