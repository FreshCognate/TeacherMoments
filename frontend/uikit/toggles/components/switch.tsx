import React from 'react';
import classnames from 'classnames';

const Switch = ({
  value,
  label,
  size = 'rg',
  onChange
}: {
  value: boolean,
  label?: string,
  size?: 'sm' | 'rg'
  onChange: (value: boolean) => void
}) => {
  const trackClassName = classnames('relative inline-flex shrink-0 rounded-full transition-colors', {
    'bg-primary-regular': value,
    'bg-lm-4 dark:bg-dm-3': !value,
    'h-5 w-10': size === 'rg',
    'h-4 w-8': size === 'sm'
  });

  const knobClassName = classnames('absolute top-0.5 left-0.5 rounded-full bg-white shadow transition-transform', {
    'translate-x-5': value && size === 'rg',
    'translate-x-4': value && size === 'sm',
    'h-4 w-4': size === 'rg',
    'h-3 w-3': size === 'sm',
  });

  const labelClassName = classnames('opacity-60', {
    'text-sm': size === 'rg',
    'text-xs': size === 'sm',
  })

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      className="inline-flex items-center gap-x-2"
      onClick={() => onChange(!value)}
    >
      <span className={trackClassName}>
        <span className={knobClassName} />
      </span>
      {label && (
        <span className={labelClassName}>{label}</span>
      )}
    </button>
  );
};

export default Switch;
