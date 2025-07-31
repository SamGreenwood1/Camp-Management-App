import * as React from 'react';
import {
  RouterProvider,
  createRouter,
  Route,
  RootRoute,
  lazyRouteComponent,
} from '@tanstack/router';

// Lazy load pages for code splitting
const PublicLandingPage = React.lazy(() => import('./pages/public/index'));
const AboutPage = React.lazy(() => import('./pages/public/about'));
const ContactPage = React.lazy(() => import('./pages/public/contact'));
const DashboardPage = React.lazy(() => import('./pages/index'));

const rootRoute = new RootRoute({
  component: () => <React.Suspense fallback={<div>Loading...</div>}><Outlet /></React.Suspense>,
});

const publicRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/public',
  component: lazyRouteComponent(() => import('./pages/public/index')),
});
const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/public/about',
  component: lazyRouteComponent(() => import('./pages/public/about')),
});
const contactRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/public/contact',
  component: lazyRouteComponent(() => import('./pages/public/contact')),
});
const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/index')),
});

const routeTree = rootRoute.addChildren([
  publicRoute,
  aboutRoute,
  contactRoute,
  dashboardRoute,
]);

const router = createRouter({
  routeTree,
});

export default function AppRouter() {
  return <RouterProvider router={router} />;
} 