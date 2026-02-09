import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import classnames from 'classnames';
import Icon from '~/uikit/icons/components/icon';
import ValidationIndicatorContainer from '../containers/validationIndicatorContainer';

export type ValidationError = {
  message: string,
  elementType: string,
  elementId: string,
}

type Props = {
  errors: ValidationError[];
  className?: string;
  variant?: 'pill' | 'inline';
}

const transition = { ease: [0.8, 0, 0.3, 1], duration: 0.15 };

export default function ValidationIndicator({
  errors,
  className,
  variant = 'pill'
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [showAbove, setShowAbove] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current?.contains(event.target as Node) ||
        popupRef.current?.contains(event.target as Node)
      ) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [isOpen]);

  const onClose = useCallback(() => setIsOpen(false), []);

  if (!errors || errors.length === 0) return null;

  const count = errors.length;
  const text = count === 1 ? '1 issue' : `${count} issues`;

  const onToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isAbove = rect.top > window.innerHeight / 2;
      setShowAbove(isAbove);
      const showLeft = rect.right > window.innerWidth / 2;
      const vertical = isAbove
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 };
      const horizontal = showLeft
        ? { right: window.innerWidth - rect.right }
        : { left: rect.left };
      setPopupStyle({ ...vertical, ...horizontal });
    }
    setIsOpen(!isOpen);
  };

  const classes = classnames(
    'flex items-center gap-x-1.5 text-xs cursor-pointer',
    'text-yellow-500 dark:text-yellow-200',
    {
      'py-1 px-2 rounded-md': variant === 'pill',
      'bg-yellow-500/10 dark:bg-yellow-400/10': variant === 'pill',
      'border border-yellow-500/30 dark:border-yellow-400/10': variant === 'pill',
      'hover:bg-yellow-500/20 dark:hover:bg-yellow-400/20': variant === 'pill',
      'hover:text-yellow-700 dark:hover:text-yellow-300': variant === 'inline',
    },
    className
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className={classes}
        onClick={onToggle}
        aria-label={`${count} validation ${count === 1 ? 'issue' : 'issues'}. Click to view.`}
        aria-expanded={isOpen}
      >
        <Icon icon="warning" size={12} />
        <span className="font-medium">{text}</span>
      </button>
      {isOpen && createPortal(
        <motion.div
          ref={popupRef}
          style={popupStyle}
          className="fixed z-50 min-w-72 max-w-96 bg-lm-0 dark:bg-dm-0 border border-lm-2 dark:border-dm-2 rounded-md shadow-lg"
          initial={{ opacity: 0, y: showAbove ? 4 : -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
        >
          <div className="px-2 py-2 border-b border-lm-2 dark:border-dm-2">
            <span className="flex items-center gap-x-1 text-xs font-medium text-black/60 dark:text-white/60"><Icon icon="info" size={14} />Issues</span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <ValidationIndicatorContainer errors={errors} onClose={onClose} />
          </div>
        </motion.div>,
        document.body
      )}
    </div>
  );
}
