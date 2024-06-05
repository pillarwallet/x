import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// pages
import App from '../pages/App';
import LandingPage from '../pages/Landing';
import Lobby from '../pages/Lobby';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

// hooks
import useAllowedApps from '../hooks/useAllowedApps';

export const navigationRoute = {
  home: '/',
  landing: '/landing',
  login: '/login',
}

export const AuthorizedNavigation = () => {
  const { allowed: allowedApps } = useAllowedApps();
  const navLocation = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (navLocation.pathname && navLocation.pathname.startsWith(navigationRoute.login)) {
      navigate(navigationRoute.home);
    }
  }, [navigate, navLocation.pathname]);

  return (
    <Routes>
      <Route path={navigationRoute.home} element={<Lobby />} />
      <Route path={navigationRoute.landing} element={<LandingPage />} />
      {allowedApps.map((appId) => (
        <Route key={appId} path={'/' + appId} element={<App id={appId} />} />
      ))}
      {process.env.REACT_APP_PX_DEVELOPMENT_ID && <Route path={`${process.env.REACT_APP_PX_DEVELOPMENT_ID}`} element={<App id={process.env.REACT_APP_PX_DEVELOPMENT_ID!} />} />}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export const UnauthorizedNavigation = () => {
  return (
    <Routes>
      <Route path={navigationRoute.home} element={<LandingPage />} />
      <Route path={navigationRoute.login} element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
