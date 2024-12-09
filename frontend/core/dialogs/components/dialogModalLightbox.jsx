import React from 'react';
import { motion } from 'framer-motion';
import classnames from 'classnames';

const DialogModalLightbox = ({
  children,
  isSidePanel
}) => {
  const className = classnames("fixed top-0 left-0 w-full h-full", {
    "bg-dm-2 bg-opacity-20 dark:bg-dm-2 dark:bg-opacity-20": isSidePanel,
    "bg-dm-2 bg-opacity-80 dark:bg-dm-2 dark:bg-opacity-80": !isSidePanel,
  })
  return (
    <motion.div
      className={className}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ ease: 'linear', duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default DialogModalLightbox;