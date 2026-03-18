import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ isHeader }) => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: "easeInOut" } }
  };

  return (
    <motion.div 
      className={isHeader ? "logo-fixed" : "logo-fullscreen"}
      layoutId="main-logo"
    >
      <svg width="80" height="80" viewBox="0 0 100 100">
        <motion.path
          d="M60,20 L60,60 C60,75 45,80 35,75 C25,70 20,65 20,60"
          fill="transparent"
          stroke="#00f7ff"
          strokeWidth="8"
          strokeLinecap="round"
          variants={draw}
          initial="hidden"
          animate="visible"
        />
        <circle cx="60" cy="15" r="6" fill="#00f7ff" />
      </svg>
    </motion.div>
  );
};
export default Logo;