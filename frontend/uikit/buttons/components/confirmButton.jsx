import React, { useCallback, useMemo, useRef, useState } from 'react';
import FlatButton from './flatButton';
import { motion } from 'framer-motion';
import useOnClickOutside from '~/core/app/hooks/useOnClickOutside';

const ConfirmButton = ({
  text,
  icon,
  title,
  color,
  onClick
}) => {

  const [isConfirming, setIsConfirming] = useState(false);

  const ref = useRef();

  const onClickOutside = useCallback(() => {
    setIsConfirming(false);
  }, []);

  useOnClickOutside(ref, onClickOutside);

  return (
    <div className="flex" ref={ref}>
      <FlatButton
        text={isConfirming ? '' : text}
        icon={isConfirming ? 'cancel' : icon}
        title={isConfirming ? 'Cancel' : title}
        color={isConfirming ? '' : color}
        onClick={() => {
          setIsConfirming(!isConfirming);
        }}
      />
      {(isConfirming) && (
        <motion.div
          animate={{ x: 0 }}
          initial={{ x: -24 }}
        >
          <FlatButton
            icon="confirm"
            className="ml-2"
            title="Confirm"
            color="warning"
            onClick={onClick}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ConfirmButton;