import { Route, Routes } from 'react-router-dom';

// pages
import Lobby from '../pages/Lobby';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

// apps
import { allowedApps } from '../apps';

// types
import App from '../pages/App';

export const navigationRoute = {
  home: '/',
}

export const AuthorizedNavigation = () => {
  return (
    <Routes>
      <Route path={navigationRoute.home} element={<Lobby />} />
      {allowedApps.map((appId) => (
        <Route key={appId} path={'/' + appId} element={<App id={appId} />} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export const UnauthorizedNavigation = () => {
  return (
    <Routes>
      <Route path={'/'} element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
