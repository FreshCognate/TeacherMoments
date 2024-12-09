import React from 'react';
import Icon from '~/uikit/icons/components/icon';

const Loading = ({
  text,
  size = "rg"
}) => {

  const textClassName = size === 'rg' ? 'ml-2' : 'ml-1'

  return (
    <div className="flex items-center w-full justify-center p-4">
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