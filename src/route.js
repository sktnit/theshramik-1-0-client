import { lazy } from 'react';

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
    element: lazy(() => import('./components/Register/Register')),
    exact: true
  }
];

const privateRoutes = [
  {
    path: 'user-profile',
    element: lazy(() => import('./components/UserProfile/UserProfile')),
    exact: true
  }
]
export {
  publicRoutes,
  privateRoutes
};