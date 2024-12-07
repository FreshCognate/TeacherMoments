import classnames from 'classnames';
import React from 'react';
import isValueEmpty from '~/core/slate/helpers/isValueEmpty';

const Body = ({ size = 'rg', body, className = '' }) => {

  if (isValueEmpty(body)) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: body }}
      className={classnames({
        'text-xl': size === 'xl',
        'text-lg': size === 'lg',
        'text-sm': size === 'sm',
        'text-xs': size === 'xs',
      }, className)}
    />
  );
};

export default Body;