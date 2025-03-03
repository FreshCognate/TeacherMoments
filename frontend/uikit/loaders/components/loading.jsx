import React from 'react';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';

const Loading = ({
  text,
  size = "rg",
  className
}) => {

  const textClassName = classnames({
    'ml-2 text-rg': size === 'rg',
    'ml-1 text-sm': size !== 'rg'
  });

  const elementClassName = classnames("flex items-center w-full justify-center", {
    "p-4": size === 'rg'
  }, className)

  return (
    <div className={elementClassName}>
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