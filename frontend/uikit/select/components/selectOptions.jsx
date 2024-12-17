import React from 'react';
import map from 'lodash/map';
import classnames from 'classnames';

const SelectOptions = ({
  className,
  options,
  value,
  isDisabled,
  onChange
}) => {

  const classes = classnames('', className);

  return (
    <select className={classes} value={value} disabled={isDisabled} onChange={(event) => onChange(event.target.value)}>
      {map(options, (option) => {
        return (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        );
      })}
    </select>
  );
};

export default SelectOptions;