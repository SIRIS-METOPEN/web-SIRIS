import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/root-layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: () =>
          import('./pages/home').then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: 'login',
        lazy: () =>
          import('./pages/login').then((module) => ({
            Component: module.default,
          })),
      },
    ],
  },
]);
