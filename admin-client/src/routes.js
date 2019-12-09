import Dashboard from './views/Dashboard';
import Users from './views/Users';
import Admin from './views/Admin';

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'line-chart',
    component: Dashboard,
    layout: '/admin',
  },
  {
    path: '/users',
    name: 'Users',
    icon: 'user',
    component: Users,
    layout: '/admin',
  },
  {
    path: '/create-admin',
    name: 'Create new Admin',
    icon: 'usergroup-add',
    component: Admin,
    layout: '/admin',
  },
  // {
  //   path: '/tags',
  //   name: 'Tags',
  //   icon: 'tags',
  //   // component: UserProfile,
  //   layout: '/admin',
  // },
  // {
  //   path: '/contracts',
  //   name: 'Contracts',
  //   icon: 'contacts',
  //   // component: UserProfile,
  //   layout: '/admin',
  // },
  // {
  //   path: '/complains',
  //   name: 'Complains',
  //   icon: 'question',
  //   // component: UserProfile,
  //   layout: '/admin',
  // },
  // {
  //   path: '/account',
  //   name: 'Settings',
  //   icon: 'setting',
  //   // component: UserProfile,
  //   layout: '/admin',
  // },
];

export default dashboardRoutes;
