import React, { useEffect, useRef } from 'react';
import './3DMart.css';

const ThreeDMart = () => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    // Load Three.js
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    threeScript.async = true;
    document.head.appendChild(threeScript);

    threeScript.onload = () => {
      // Load the 3D mart script
      const martScript = document.createElement('script');
      martScript.src = '/gmr-smart-mart-3d.js';
      martScript.async = true;
      document.head.appendChild(martScript);
      scriptRef.current = martScript;
    };

    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
      if (threeScript) {
        document.head.removeChild(threeScript);
      }
    };
  }, []);

  return (
    <div className="mart-container">
      <div ref={containerRef} id="mart-root" />
    </div>
  );
};

export default ThreeDMart;
