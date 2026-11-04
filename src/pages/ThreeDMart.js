import React from 'react';

const ThreeDMart = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="/3d-mart.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        title="GMR Smart Mart 3D"
      />
    </div>
  );
};

export default ThreeDMart;
