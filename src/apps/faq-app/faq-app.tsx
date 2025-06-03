import React from 'react';

const FaqApp: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="https://docs.pillarx.app/faq/frequently-asked-questions-faq"
        title="PillarX FAQ - Frequently Asked Questions"
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        allow="fullscreen"
      />
    </div>
  );
};

export default FaqApp;