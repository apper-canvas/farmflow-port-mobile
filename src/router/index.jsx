import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { getRouteConfig } from "./route.utils";
import Root from "@/layouts/Root";
import Layout from "@/components/organisms/Layout";

// Lazy load components
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Farms = lazy(() => import("@/components/pages/Farms"));
const Crops = lazy(() => import("@/components/pages/Crops"));
const Tasks = lazy(() => import("@/components/pages/Tasks"));
const Finances = lazy(() => import("@/components/pages/Finances"));
const Weather = lazy(() => import("@/components/pages/Weather"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Callback = lazy(() => import("@/pages/Callback"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/pages/PromptPassword"));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

// createRoute helper
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path.startsWith('/') ? path : `/${path}`);
  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  };
};

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // Public authentication routes
      createRoute({
        path: 'login',
        element: <Login />,
        title: 'Login'
      }),
      createRoute({
        path: 'signup',
        element: <Signup />,
        title: 'Sign Up'
      }),
      createRoute({
        path: 'callback',
        element: <Callback />,
        title: 'Authentication Callback'
      }),
      createRoute({
        path: 'error',
        element: <ErrorPage />,
        title: 'Error'
      }),
      createRoute({
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Prompt Password'
      }),
      
      // Main application routes
      {
        path: '/',
        element: <Layout />,
        children: [
          createRoute({
            index: true,
            element: <Dashboard />,
            title: 'Dashboard'
          }),
          createRoute({
            path: 'farms',
            element: <Farms />,
            title: 'Farms'
          }),
          createRoute({
            path: 'crops',
            element: <Crops />,
            title: 'Crops'
          }),
          createRoute({
            path: 'tasks',
            element: <Tasks />,
            title: 'Tasks'
          }),
          createRoute({
            path: 'finances',
            element: <Finances />,
            title: 'Finances'
          }),
          createRoute({
            path: 'weather',
            element: <Weather />,
            title: 'Weather'
          }),
          createRoute({
            path: '*',
            element: <NotFound />,
            title: 'Page Not Found'
          })
        ]
      }
    ]
  }
]);

export default router;