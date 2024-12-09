import React from 'react';
import classnames from 'classnames';

interface Props {
  value: string;
  placeholder?: string;
  className?: string;
  shouldAutoFocus?: boolean;
  onFocus?: (param: any) => any;
  onBlur?: (param: any) => any;
  onChange: (param: any) => any;
  onSearch?: (param: any) => any;
  onKeyDown?: (param: any) => any;
}

const Search = ({
  value,
  placeholder,
  className,
  shouldAutoFocus,
  onChange,
  onSearch,
  onFocus,
  onBlur,
  onKeyDown
}: Props) => {
  const classes = classnames('border border-lm-3 py-1 text-sm px-2 dark:border-dm-3 rounded focus:outline-2 outline-primary-regular dark:outline-primary-light outline-offset-1', className);
  return (
    <div>
      <input
        value={value || ''}
        placeholder={placeholder}
        autoFocus={shouldAutoFocus}
        className={classes}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (onKeyDown) {
            return onKeyDown(event);
          }
          if (event.key === 'Enter') {
            if (onSearch) {
              onSearch(value)
            }
          }
        }}
      />
    </div>
  );
}

export default Search;