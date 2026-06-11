import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/root-layout';
import { PublicLayout } from './layouts/public-layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        // Public routes that share the Navbar
        element: <PublicLayout />,
        children: [
          {
            index: true,
            lazy: () =>
              import('./pages/home').then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: 'faq',
            lazy: () =>
              import('./pages/faq').then((module) => ({
                Component: module.default,
              })),
          },
        ],
      },
      // Routes without Navbar (Auth, Dashboard, etc)
      {
        path: 'login',
        lazy: () =>
          import('./pages/login').then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: 'signup',
        lazy: () =>
          import('./pages/signup').then((module) => ({
            Component: module.default,
          })),
      },
    ],
  },
]);
