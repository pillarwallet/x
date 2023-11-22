import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

// pages
import Account from '../pages/Account';
import Transfer from '../pages/Transfer';
import History from '../pages/History';
import NotFound from '../pages/NotFound';
import Apps from '../pages/Apps';
import Login from '../pages/Login';
import Loading from '../pages/Loading';

export const navigationRoute = {
  home: '/',
  transfer: '/transfer',
  history: '/history',
  apps: '/apps',
}

const Navigation = () => {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return <Loading />
  }

  if (!authenticated) {
    return (
      <Routes>
        <Route path={navigationRoute.home} element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path={navigationRoute.home} element={<Account />} />
      <Route path={navigationRoute.transfer} element={<Transfer />} />
      <Route path={navigationRoute.history} element={<History />} />
      <Route path={navigationRoute.apps} element={<Apps />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Navigation;
