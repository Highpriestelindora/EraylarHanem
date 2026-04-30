import React from 'react';
import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

export default function AnimatedPage({ children, className }) {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
      style={{ 
        width: '100%',
        height: '100%',
        willChange: 'opacity'
      }}
    >
      {children}
    </motion.div>
  );
}
