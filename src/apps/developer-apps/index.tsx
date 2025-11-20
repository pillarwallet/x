import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// api
import { useGetDeveloperAppQuery } from './api/developerAppsApi';

// components
import AppsList from './components/AppsList';
import AppForm from './components/AppForm';

// styles
import './styles/developers.css';

const CreateAppPage: React.FC = () => {
  return <AppForm mode="create" />;
};

const EditAppPage: React.FC = () => {
  const [appId, setAppId] = React.useState<string>('');

  // Extract appId from URL
  React.useEffect(() => {
    const path = window.location.pathname;
    const matches = path.match(/\/edit\/([^/]+)$/);
    if (matches && matches[1]) {
      setAppId(matches[1]);
    }
  }, []);

  const { data, isLoading, error } = useGetDeveloperAppQuery(appId, {
    skip: !appId,
  });

  if (!appId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-400 font-mono">Loading app data...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 mb-6 rounded-full bg-red-900/20 border border-red-700/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">App Not Found</h2>
        <p className="text-gray-400 mb-6">The app you're looking for doesn't exist.</p>
        <a
          href="/app/developer-apps"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-300"
        >
          Back to My Apps
        </a>
      </div>
    );
  }

  return <AppForm mode="edit" existingApp={data.data} />;
};

const DevelopersApp: React.FC = () => {
  return (
    <div className="developers-app min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route index element={<AppsList />} />
          <Route path="create" element={<CreateAppPage />} />
          <Route path="edit/:appId" element={<EditAppPage />} />
          <Route path="*" element={<Navigate to="/app/developer-apps" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default DevelopersApp;

