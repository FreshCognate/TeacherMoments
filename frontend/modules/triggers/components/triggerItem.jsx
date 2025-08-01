import React from 'react';
import classnames from 'classnames';
import FlatButton from '~/uikit/buttons/components/flatButton';
import getTriggerDescription from '../helpers/getTriggerDescription';
import Body from '~/uikit/content/components/body';
import FormContainer from '~/core/forms/containers/formContainer';
import Options from '~/uikit/dropdowns/components/options';

const TriggerItem = ({
  trigger,
  schema,
  isLastTrigger,
  isOptionsOpen,
  onSortUpClicked,
  onSortDownClicked,
  onToggleActionsClicked,
  onActionClicked,
  onFormUpdate
}) => {
  return (
    <div className={classnames(
      "p-4 rounded-md",
      "bg-lm-0 dark:bg-dm-0",
      "border border-lm-3 dark:border-dm-2"
    )}>
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center mr-2">
          {(trigger.sortOrder !== 0) && (
            <FlatButton icon="sortUp" size="sm" onClick={() => onSortUpClicked(trigger.sortOrder)} />
          )}
          {(!isLastTrigger) && (
            <FlatButton icon="sortDown" size="sm" className="ml-3" onClick={() => onSortDownClicked(trigger.sortOrder)} />
          )}
        </div>
        <Options
          options={[{
            text: 'Delete trigger',
            icon: 'delete',
            color: 'warning',
            action: 'DELETE'
          }]}
          title="Trigger options"
          isOpen={isOptionsOpen}
          onToggle={onToggleActionsClicked}
          onOptionClicked={onActionClicked}
        />
      </div>
      <div className="mb-1 flex items-center justify-between">
        <Body body={getTriggerDescription(trigger)} size="sm" />
      </div>
      <div>
        <FormContainer
          schema={schema}
          model={trigger}
          onUpdate={onFormUpdate}
        />
      </div>
    </div>
  );
};

export default TriggerItem;