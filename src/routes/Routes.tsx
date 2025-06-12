import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import { RouteNames } from '@/constants/routeNames';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { Error404 } from '@/pages/Error404';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Login } from '@/pages/Login';
import { Profile } from '@/pages/Profile';
import { Register } from '@/pages/Register';
import { ResetPassword } from '@/pages/ResetPassword';
import { Room } from '@/pages/Room';
import { Rooms } from '@/pages/Rooms';
import { VerifyEmail } from '@/pages/VerifyEmail';

export const appRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: RouteNames.Login, element: <Login /> },
      { path: RouteNames.Register, element: <Register /> },
      { path: RouteNames.ForgotPassword, element: <ForgotPassword /> },
      { path: RouteNames.ResetPassword, element: <ResetPassword /> },
      { path: RouteNames.VerifyEmail, element: <VerifyEmail /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to={RouteNames.Rooms} replace />,
      },
      {
        path: RouteNames.Profile,
        element: <Profile />,
      },
      { path: RouteNames.Rooms, element: <Rooms /> },
      { path: RouteNames.Room, element: <Room /> },
    ],
  },
  {
    path: '*',
    element: <Error404 />,
  },
];

export const router = createBrowserRouter(appRoutes);
