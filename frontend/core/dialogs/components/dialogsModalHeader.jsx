import React from 'react';
import { motion } from 'framer-motion';

import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';

const animation = {
  animate: { y: 0, opacity: 1 },
  initial: { y: 10, opacity: 0 },
  transition: { ease: [0.8, 0, 0.3, 1], duration: 0.3, delay: 0.6 },
};

const DialogsModalHeader = ({
  title,
  body,
  icon,
}) => {
  if (!title && !body && !icon) return null;
  return (
    <div className="relative p-4 flex items-center">
      {icon && (
        <motion.div
          className="mr-4"
          animate={animation.animate}
          initial={animation.initial}
          transition={animation.transition}
        >
          <Icon icon={icon} size={48} />
        </motion.div>
      )}
      <div>
        <Title
          element="h6"
          title={title}
          className="text-lg font-light"
        />
        <Body
          body={body}
          className="text-black/60 dark:text-white/60"
        />
      </div>
    </div>
  );
};

export default DialogsModalHeader;