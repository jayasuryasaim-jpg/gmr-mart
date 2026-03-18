import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div className="logo-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <svg viewBox="0 0 400 400" width="200" height="200">
        <defs>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#1a2a6c" />
          </linearGradient>
        </defs>

        {/* Shield Base */}
        <path d="M200 50 L350 100 V200 C350 300 200 350 200 350 C200 350 50 300 50 200 V100 Z" 
              fill="url(#shieldGrad)" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
        
        {/* Integrated 'J' Design */}
        <path d="M160 120 L160 260 C160 290 200 300 240 280 L260 260" 
              fill="none" stroke="#ffffff" strokeWidth="25" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};
export default Logo;