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
          {
            path: 'edukasi-qris',
            lazy: () =>
              import('./pages/edukasi-qris').then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: 'laporkan',
            lazy: () =>
              import('./pages/laporkan').then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: 'status',
            lazy: () =>
              import('./pages/status').then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: 'riwayat',
            lazy: () =>
              import('./pages/riwayat').then((module) => ({
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
      // Admin Dashboard Routes
      {
        path: 'admin',
        lazy: () =>
          import('./layouts/admin-layout').then((module) => ({
            Component: module.default,
          })),
        children: [
          {
            index: true,
            lazy: () =>
              import('./pages/admin/dashboard').then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: 'reports',
            lazy: () =>
              import('./pages/admin/reports-list').then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: 'reports/:id',
            lazy: () =>
              import('./pages/admin/report-detail').then((module) => ({
                Component: module.default,
              })),
          },
          {
            path: 'statistik',
            lazy: () =>
              import('./pages/admin/statistik').then((module) => ({
                Component: module.default,
              })),
          },
        ],
      },
    ],
  },
]);
