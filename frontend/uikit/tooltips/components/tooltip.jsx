import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useOnClickOutside from '~/core/app/hooks/useOnClickOutside';
import Icon from '~/uikit/icons/components/icon';

const animation = {
  animate: { opacity: 1, scale: 1 },
  initial: { opacity: 0, scale: 0.95 },
  transition: { ease: [0.8, 0, 0.3, 1], duration: 0.15 },
};

const Tooltip = ({
  content,
  icon = 'info',
  iconSize = 14,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setIsOpen(false), isOpen);

  if (!content) return null;

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-regular focus:ring-offset-1 rounded-full"
        aria-label="More information"
        aria-expanded={isOpen}
      >
        <Icon icon={icon} size={iconSize} />
      </button>
      {isOpen && (
        <motion.div
          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-10"
          animate={animation.animate}
          initial={animation.initial}
          transition={animation.transition}
        >
          <div
            className="bg-lm-0 dark:bg-dm-0 border border-lm-2 dark:border-dm-2 rounded-md shadow-lg p-3 text-xs text-black/80 dark:text-white/80 min-w-64 max-w-80"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(Tooltip);
