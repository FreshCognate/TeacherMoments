import React from 'react';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import classnames from 'classnames';

const Required = ({
  isRequired,
  isComplete
}) => {

  if (!isRequired) return null;

  const icon = isComplete ? "confirm" : "asterisk";
  const iconClassName = classnames({
    "text-warning-regular dark:text-warning-light": !isComplete,
    "text-primary-regular dark:text-primary-light": isComplete,
  });

  const textClassName = classnames("ml-1", {
    "text-warning-regular dark:text-warning-light": !isComplete,
    "text-primary-regular dark:text-primary-light": isComplete
  });
  const text = isComplete ? "Complete" : "Required"
  return (
    <div title="This prompt requires a response" className="flex items-center" >
      <Icon icon={icon} className={iconClassName} size={12} />
      <Body body={text} size="xs" className={textClassName} />
    </div>
  );
};

export default Required;