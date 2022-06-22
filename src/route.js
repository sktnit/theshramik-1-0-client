import { lazy } from 'react';
import { constants } from './constants';

const publicRoutes = [
  {
    path: '/',
    element: lazy(() => import('./components/WelcomePage/Welcome')),
    exact: true
  },
  {
    path: 'about',
    element: lazy(() => import('./components/AboutUs/AboutUs')),
    exact: true
  },
  {
    path: 'login',
    element: lazy(() => import('./components/Login/Login')),
    exact: true
  },
  {
    path: 'register',
    element: lazy(() => import('./components/Register/NewRegister')),
    exact: true
  }
];

const protectedRoutes = [
  {
    path: 'user-details',
    element: lazy(() => import('./components/UserProfile/Details')),
    exact: true,
    accessControls: [constants.EMPLOYEE_KEYWORD, constants.EMPLOYER_KEYWORD, constants.ADMIN_KEYWORD]
  }
];

const privateRoutes = [
  {
    path: 'user-profile',
    element: lazy(() => import('./components/UserProfile/UserProfile')),
    exact: true,
    accessControls: [constants.EMPLOYEE_KEYWORD, constants.EMPLOYER_KEYWORD, constants.ADMIN_KEYWORD]
  },
  {
    path: 'user-profile/edit',
    element: lazy(() => import('./components/UserProfile/UserProfileEdit')),
    exact: true,
    accessControls: [constants.EMPLOYEE_KEYWORD, constants.EMPLOYER_KEYWORD, constants.ADMIN_KEYWORD]
  },
  {
    path: 'home',
    element: lazy(() => import('./components/Home/Home')),
    exact: true,
    accessControls: [constants.EMPLOYER_KEYWORD, constants.ADMIN_KEYWORD]
  },
  {
    path: 'admin-dashboard',
    element: lazy(() => import('./components/AdminDashboard/AdminDashboard')),
    exact: true,
    accessControls: [constants.ADMIN_KEYWORD]
  }
]
export {
  publicRoutes,
  protectedRoutes,
  privateRoutes
};