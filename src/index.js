import React from 'react';
import ReactDOM from 'react-dom/client';

// Render the full 3D mart as the root experience.
// The standalone HTML file lives in public/3d-mart.html and is copied
// to the build root by react-scripts, so it's always reachable at /3d-mart.html.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <iframe
    src="/3d-mart.html"
    title="GMR Smart Mart 3D"
    style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      border: 'none',
      display: 'block',
    }}
  />
);
