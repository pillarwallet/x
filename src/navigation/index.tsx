/* eslint-disable import/extensions */
import { useEffect } from 'react';
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useLocation,
  useNavigate,
} from 'react-router-dom';

// pages
import Advertising from '../pages/Advertising';
import Developers from '../pages/Developers';
import LandingPage from '../pages/Landing';
import Lobby from '../pages/Lobby';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import WaitList from '../pages/WaitList';
import Privacy from '../pages/Privacy';

export const navigationRoute = {
  home: '/',
  landing: '/landing',
  waitlist: '/waitlist',
  developers: '/developers',
  advertising: '/advertising',
  privacy: '/privacy-policy',
  login: '/login',
};

export const AuthorizedNavigation = () => {
  const navLocation = useLocation();
  const navigate = useNavigate();
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Lobby />,
    },
    {
      path: '/landing',
      element: <LandingPage />,
    },
    {
      path: '/waitlist',
      element: <WaitList />,
    },
    {
      path: '/developers',
      element: <Developers />,
    },
    {
      path: '/advertising',
      element: <Advertising />,
    },
    {
      path: '/privacy-policy',
      element: <Privacy />,
    },
  ]);

  useEffect(() => {
    if (
      navLocation.pathname &&
      navLocation.pathname.startsWith(navigationRoute.login)
    ) {
      navigate(navigationRoute.home);
    }
  }, [navigate, navLocation.pathname]);

  return <RouterProvider router={router} />;
};

export const UnauthorizedNavigation = () => {
  return (
    <Routes>
      <Route path={navigationRoute.home} element={<LandingPage />} />
      <Route path={navigationRoute.waitlist} element={<WaitList />} />
      <Route path={navigationRoute.developers} element={<Developers />} />
      <Route path={navigationRoute.advertising} element={<Advertising />} />
      <Route path={navigationRoute.privacy} element={<Privacy />} />
      <Route path={navigationRoute.login} element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
