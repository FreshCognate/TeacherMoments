import React, { useRef } from 'react';
import map from 'lodash/map';
import useOnClickOutside from '~/core/app/hooks/useOnClickOutside';

const Dropdown = ({
  options,
  placeholder,
  isOpen,
  onToggle,
  onOptionClicked
}) => {
  const ref = useRef();

  useOnClickOutside(ref, () => onToggle(false));

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-lm-5 dark:text-dm-5 hover:bg-lm-1 dark:hover:bg-dm-2 rounded-md transition-colors"
      >
        <span>{placeholder}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 min-w-40 bg-lm-0 dark:bg-dm-0 border border-lm-2 dark:border-dm-2 rounded-md shadow-lg py-1 px-1">
          {map(options, (option, index) => {
            if (option.separator) {
              return <div key={`sep-${index}`} className="h-px my-1 bg-lm-1 dark:bg-dm-1" />;
            }
            return (
              <button
                key={option.value || option.action || index}
                type="button"
                onClick={() => {
                  onOptionClicked(option.value || option.action);
                  onToggle(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-lm-5 dark:text-dm-5 hover:bg-lm-1 dark:hover:bg-dm-1 transition-colors rounded-md"
              >
                {option.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
