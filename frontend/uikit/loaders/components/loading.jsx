import React from 'react';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';

const Loading = ({
  text,
  size = "rg"
}) => {

  const textClassName = classnames({
    'ml-2 text-rg': size === 'rg',
    'ml-1 text-sm': size !== 'rg'
  });

  const className = classnames("flex items-center w-full justify-center", {
    "p-4": size === 'rg'
  })

  return (
    <div className={className}>
      <Icon icon="syncing" size={size === 'rg' ? 24 : 16} className="animate-spin" />
      {(text) && (
        <span className={textClassName}>
          {text}
        </span>
      )}
    </div>
  );

};

export default Loading;