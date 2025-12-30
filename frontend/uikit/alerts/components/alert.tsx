import React from 'react';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';
import Button from '~/uikit/buttons/components/button';

const ICONS = {
  info: 'info',
  warning: 'warning'
};

const Alert = ({
  type,
  text,
  actionText,
  onActionClicked
}: {
  type?: 'info' | 'warning',
  text: string,
  actionText?: string,
  onActionClicked?: () => void
}) => {

  const iconClassName = classnames("p-1 rounded-full mr-3", {
    "bg-primary-regular dark:bg-primary-light": type === 'info',
    "bg-warning-regular dark:bg-warning-light": type === 'warning',
  });

  return (
    <div className="flex items-center p-2 bg-lm-0/60 rounded-lg dark:bg-dm-0/30">
      {(type && ICONS[type]) && (
        <div className={iconClassName}>
          <Icon icon={ICONS[type]} className="text-button-default" />
        </div>
      )}
      <div className="text-sm text-black/60 dark:text-white/60">
        <Body body={text} />
      </div>
      {(actionText && onActionClicked) && (
        <div className="ml-lg">
          <Button text={actionText} color="primary" onClick={onActionClicked} />
        </div>
      )}
    </div>
  );
};

export default Alert;