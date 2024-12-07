import React from 'react';
import Icons from '../helpers/icons';
import map from 'lodash/map';

const Icon = ({ icon, size, className, ariaLabel }) => {
  const iconSize = size || 24;

  if (!icon) {
    console.warn("Please provide an icon to the uikit Icon component");
    return null;
  }

  if (!Icons[icon]) {
    console.warn(`${icon} icon does not exist`);
    return null;
  }

  const elements = map(Icons[icon].elements, (element, index) => {
    return React.cloneElement(element, { key: index });
  });

  return (
    <svg className={className} fill='none' aria-hidden={!ariaLabel} aria-label={ariaLabel} width={iconSize} height={iconSize} viewBox={Icons[icon].viewBox}>
      {elements}
    </svg>
  );
};

export default Icon;