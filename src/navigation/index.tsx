import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

// pages
import Lobby from '../pages/Lobby';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import App from '../pages/App';
import LandingPage from '../pages/Landing';

// hooks
import useAllowedApps from '../hooks/useAllowedApps';

export const navigationRoute = {
  home: '/',
  landing: '/landing',
  login: '/login',
}

const DevApp = () => {
  const params = useParams();
  return <App id={params?.appId as string} />
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
      {process.env.NODE_ENV === 'development' && (
        <Route
          key={'test-app-route'}
          path={'/development/:appId'}
          element={<DevApp />}
        />
      )}
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
