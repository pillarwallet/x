import React from 'react';
import { Route, Routes } from 'react-router-dom';

// pages
import Lobby from '../pages/Lobby';
import Transfer from '../pages/Transfer';
import History from '../pages/History';
import NotFound from '../pages/NotFound';
import Apps from '../pages/Apps';
import Login from '../pages/Login';

export const navigationRoute = {
  home: '/',
  transfer: '/transfer',
  history: '/history',
  apps: '/apps',
}

export const AuthorizedNavigation = () => {
  return (
    <Routes>
      <Route path={navigationRoute.home} element={<Lobby />} />
      <Route path={navigationRoute.transfer} element={<Transfer />} />
      <Route path={navigationRoute.history} element={<History />} />
      <Route path={navigationRoute.apps + '/:appId?'} element={<Apps />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export const UnauthorizedNavigation = () => {
  return (
    <Routes>
      <Route path={navigationRoute.home} element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
