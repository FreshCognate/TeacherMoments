import React, { useRef } from 'react';
import map from 'lodash/map';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import useOnClickOutside from '~/core/app/hooks/useOnClickOutside';

const SlideRefSelector = ({
  selectedSlideName,
  searchValue,
  options,
  isDropdownOpen,
  onToggleDropdown,
  onSlideSelected,
  onSearchInputChanged
}) => {
  const ref = useRef();

  useOnClickOutside(ref, () => onToggleDropdown(false));

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center justify-between px-2 py-1 border border-lm-3 dark:border-dm-3 hover:border-lm-4 dark:hover:border-dm-4 rounded cursor-pointer" onClick={() => onToggleDropdown(!isDropdownOpen)}>
        <Body body={selectedSlideName || "Select a slide..."} size='sm' />
        <Icon icon={isDropdownOpen ? "close" : "open"} size={14} />
      </div>
      {(isDropdownOpen) && (
        <div className="absolute h-60 left-0 top-full bg-lm-0 dark:bg-dm-0 z-10 border border-lm-2 dark:border-dm-2 mb-2 rounded-sm">
          <div className="p-2 border-b border-lm-2 dark:border-dm-2">
            <input
              type="search"
              value={searchValue}
              placeholder='Search slides...'
              autoFocus
              className="px-1 py-1 text-sm"
              onChange={onSearchInputChanged}
            />
          </div>
          <div>
            {map(options, (option) => {
              return (
                <div
                  className="cursor-pointer py-2 px-4 bg-lm-0 dark:bg-dm-0 hover:bg-lm-1 dark:hover:bg-dm-1 transition-colors"
                  key={option.value}
                  onClick={() => onSlideSelected(option.value)}
                >
                  {option.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideRefSelector;