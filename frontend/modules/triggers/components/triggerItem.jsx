import React from 'react';
import classnames from 'classnames';
import FlatButton from '~/uikit/buttons/components/flatButton';
import getTriggerDescription from '../helpers/getTriggerDescription';
import Body from '~/uikit/content/components/body';

const TriggerItem = ({
  trigger,
  onDeleteTriggerClicked,
  onEditTriggerClicked
}) => {
  return (
    <div className={classnames(
      "p-2 rounded-md mb-2 ",
      "bg-lm-2 dark:bg-dm-2",
      "border border-lm-2 dark:border-dm-2 hover:border-lm-3 dark:hover:border-dm-3"
    )}>
      <div className="mb-1 flex items-center justify-between">
        <Body body={getTriggerDescription(trigger)} size="sm" />
        <FlatButton icon="edit" text="Edit" size="sm" color="primary" onClick={() => onEditTriggerClicked(trigger._id)} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <FlatButton icon="delete" color="warning" size="sm" onClick={() => onDeleteTriggerClicked(trigger._id)} />
        </div>
        <div className="flex items-center">
          <FlatButton icon="sortUp" size="sm" />
          <FlatButton icon="sortDown" size="sm" className="ml-3" />
        </div>
      </div>
    </div>
  );
};

export default TriggerItem;