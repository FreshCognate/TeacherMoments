import React from 'react';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';

const BaseButton = ({
  id,
  text,
  html,
  title,
  component,
  icon,
  iconSize,
  iconPosition = 'left',
  size = 'rg',
  className,
  style,
  ariaLabel,
  ariaControls,
  isDisabled,
  isCircular = false,
  isFullWidth = false,
  onClick
}) => {

  const renderContent = () => {
    if (component) {
      return component;
    }

    return (
      <>
        {(icon && iconPosition === 'left') && (
          <Icon className={!text && !html ? "mr-0" : "mr-1"} icon={icon} size={iconSize} />
        )}
        {(html) && (
          <span dangerouslySetInnerHTML={{ __html: html }} className="inline-block" />
        )}
        {(!html) && (
          text
        )}
        {(icon && iconPosition === 'right') && (
          <Icon className={!text && !html ? "ml-0" : "ml-1"} icon={icon} size={iconSize} />
        )}
      </>
    );
  };

  return (
    <button
      id={id}
      className={classnames(className, `flex items-center disabled:opacity-50`, {
        'w-full justify-center': isFullWidth,
        // '': isCircular,
        // '': !text && !html
      })}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      style={style}
      disabled={isDisabled}
      title={title}
      onClick={onClick}
    >
      {renderContent()}
    </button>
  );
};

export default BaseButton;