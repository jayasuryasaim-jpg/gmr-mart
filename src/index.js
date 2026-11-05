// The 3D mart is fully self-contained in public/index.html.
// React mounts to a hidden div and renders nothing, so it does not
// interfere with the Three.js canvas or any DOM elements.
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(React.Fragment, null));
