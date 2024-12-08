import React from 'react';
import { motion } from 'framer-motion';
import classnames from 'classnames';

const Syncing = ({
  className,
  isSyncing
}) => {
  if (!isSyncing) return null;
  const classes = classnames("absolute w-full overflow-hidden left-0", className);
  return (
    <div className={classes} style={{ height: '2px', bottom: "-2px", borderRadius: '4px' }}>
      <motion.div
        className="absolute bg-primary-light"
        style={{ width: "10%", height: "2px", borderRadius: '2px' }}
        initial={{ left: '-10%', width: '10%' }}
        animate={{ left: '100%', width: ['10%', '20%', '10%'] }}
        transition={{ ease: 'easeInOut', duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
    </div>
  );
};

export default Syncing;