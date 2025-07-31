import * as React from 'react';
import {
  RouterProvider,
  createRouter,
  Route,
  RootRoute,
  lazyRouteComponent,
  Outlet,
} from '@tanstack/router';

// Lazy load pages for code splitting
const LandingPage = React.lazy(() => import('./pages/index'));
const LoginPage = React.lazy(() => import('./pages/login'));
const DashboardPage = React.lazy(() => import('./pages/dashboard'));
const PublicLandingPage = React.lazy(() => import('./pages/public/index'));
const AboutPage = React.lazy(() => import('./pages/public/about'));
const ContactPage = React.lazy(() => import('./pages/public/contact'));

const rootRoute = new RootRoute({
  component: () => <React.Suspense fallback={<div>Loading...</div>}><Outlet /></React.Suspense>,
});

const landingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./pages/index')),
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazyRouteComponent(() => import('./pages/login')),
});

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: lazyRouteComponent(() => import('./pages/dashboard')),
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

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  dashboardRoute,
  publicRoute,
  aboutRoute,
  contactRoute,
]);

const router = createRouter({
  routeTree,
});

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
