import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faIdBadge,
  faEnvelope,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import Home from './views/Home';
import LoginContainer from './containers/LoginContainer';
import SignUp from './views/SignUp';
import ProfileContainer from './containers/ProfileContainer';
import TeacherList from './views/TeacherList';
import Message from './views/account/message/Message';
import Contract from './views/account/contract';
import WelcomeContainer from './containers/WelcomeContainer';
import ContractDetailContainer from './containers/ContractDetailContainer';
import EmailVerification from './views/EmailVerification';
import TeacherDetailContainer from './containers/TeacherDetailContainer';
import ForgotPassword from './views/ForgotPassword';
import ChangePassword from './views/ChangePassword';

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
      path: '/forgot-password',
      name: 'Forgot password',
      component: ForgotPassword,
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
      component: TeacherDetailContainer,
      layout: '',
    },
    {
      path: '/confirm/:token',
      name: 'Mail confirm',
      component: EmailVerification,
      layout: '',
    },
    {
      path: '/change-password/:token',
      name: 'Change password',
      component: ChangePassword,
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
      sidebar: true,
      path: '/profile',
      name: 'Profile',
      component: ProfileContainer,
      layout: '/account',
      icon: <FontAwesomeIcon icon={faIdBadge} />,
    },
    {
      sidebar: true,
      path: '/messages',
      name: 'Message',
      component: Message,
      layout: '/account',
      icon: <FontAwesomeIcon icon={faEnvelope} />,
    },
    {
      exact: true,
      path: '/contracts/detail/:contractId',
      name: 'Contracts',
      component: ContractDetailContainer,
      layout: '/account',
    },
    {
      sidebar: true,
      path: '/contracts',
      name: 'Contracts',
      component: Contract,
      layout: '/account',
      icon: <FontAwesomeIcon icon={faAddressCard} />,
    },
    {
      path: '/',
      name: 'Home',
      redirectPath: '/account/profile/basic',
      layout: '/account',
    },
  ],
  teacher: [
    {
      sidebar: true,
      path: '/dashboard',
      name: 'Dashboard',
      component: () => <div>dashboard</div>,
      layout: '/account',
      icon: <FontAwesomeIcon icon={faChartBar} />,
    },
    {
      sidebar: true,
      path: '/profile',
      name: 'Profile',
      component: ProfileContainer,
      layout: '/account',
      icon: <FontAwesomeIcon icon={faIdBadge} />,
    },
    {
      sidebar: true,
      path: '/messages',
      name: 'Messages',
      component: Message,
      layout: '/account',
      icon: <FontAwesomeIcon icon={faEnvelope} />,
    },
    {
      exact: true,
      path: '/contracts/detail/:contractId',
      name: 'Contracts',
      component: ContractDetailContainer,
      layout: '/account',
    },
    {
      sidebar: true,
      path: '/contracts',
      name: 'Contracts',
      component: Contract,
      layout: '/account',
      icon: <FontAwesomeIcon icon={faAddressCard} />,
    },
    {
      exact: true,
      path: '/welcome',
      name: 'Welcome',
      component: WelcomeContainer,
      layout: '/account',
    },
    {
      exact: true,
      path: '/',
      name: 'Home',
      redirectPath: '/account/dashboard',
      layout: '/account',
    },
  ],
};

export default routes;
