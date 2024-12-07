import React from 'react';
import { motion } from 'framer-motion';

const DialogModalLightbox = ({
  children,
  isSidePanel
}) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full"
      style={{ backgroundColor: isSidePanel ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.8)' }}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ ease: 'linear', duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default DialogModalLightbox;