import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import { RouteNames } from '@/constants/routeNames';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { Board } from '@/pages/Board';
import { Error404 } from '@/pages/Error404';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Login } from '@/pages/Login';
import { Profile } from '@/pages/Profile';
import { Register } from '@/pages/Register';
import { ResetPassword } from '@/pages/ResetPassword';
import { Boards } from '@/pages/Rooms';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={RouteNames.Board} replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: RouteNames.Login, element: <Login /> },
      { path: RouteNames.Register, element: <Register /> },
      { path: RouteNames.ForgotPassword, element: <ForgotPassword /> },
      { path: RouteNames.ResetPassword, element: <ResetPassword /> },
    ],
  },
  {
    path: RouteNames.Board,
    element: <MainLayout />,
    children: [
      { index: true, element: <Board /> },
      {
        path: RouteNames.Profile,
        element: <Profile />,
      },
      { path: RouteNames.Boards, element: <Boards /> },
    ],
  },
  {
    path: '*',
    element: <Error404 />,
  },
];

export const router = createBrowserRouter(appRoutes);
