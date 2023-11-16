import React from 'react';
import Providers from './providers';
import Home from './pages/Home';

const App = () => {
  return (
    <Providers>
      {/* TODO: add router /> */}
      <Home />
    </Providers>
  );
}

export default App;
