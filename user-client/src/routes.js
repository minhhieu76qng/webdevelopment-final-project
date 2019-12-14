import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faIdBadge,
  faEnvelope,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import Home from './views/Home';
import TeacherList from './views/TeacherList';
import TeacherDetail from './views/TeacherDetail';
import LoginContainer from './containers/LoginContainer';
import SignUp from './views/SignUp';
import Profile from './views/account/profile';

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
      path: '/categories',
      name: 'Categories',
      component: TeacherList,
      layout: '',
    },
    {
      path: '/detail',
      name: 'Detail',
      component: TeacherDetail,
      layout: '',
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      layout: '',
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      layout: '/account',
    },
    {
      path: '/messages',
      name: 'Message',
      component: () => <div>messages</div>,
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
      component: Profile,
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
  ],
};

export default routes;