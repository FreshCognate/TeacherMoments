import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import classnames from 'classnames';
import Options from '~/uikit/dropdowns/components/options';
import getBlockDisplayName from '../helpers/getBlockDisplayName';
import Badge from '~/uikit/badges/components/badge';
import FlatButton from '~/uikit/buttons/components/flatButton';

const EditBlock = ({
  contentSchema,
  settingsSchema,
  block,
  canSortUp,
  canSortDown,
  isOptionsOpen,
  isDeleting,
  onEditBlockUpdate,
  onToggleActionsClicked,
  onActionClicked,
  onSortUpClicked,
  onSortDownClicked,
}) => {

  const className = classnames("w-full bg-lm-2 dark:bg-dm-1 p-4 rounded-lg mb-8", {
    "opacity-50": isDeleting
  })
  return (
    <div className={className}
    >
      <div className="flex justify-between items-center">
        <div>
          <Badge text={getBlockDisplayName(block)} className="border border-lm-2 dark:border-dm-2" />
        </div>
        <div className="flex items-center">
          <div className="flex items-center bg-lm-0 dark:bg-dm-0 rounded-lg mr-4">
            <FlatButton
              icon="sortUp"
              className="p-2"
              isDisabled={!canSortUp}
              onClick={() => onSortUpClicked(block.sortOrder)}
            />
            <FlatButton
              icon="sortDown"
              className=" p-2"
              isDisabled={!canSortDown}
              onClick={() => onSortDownClicked(block.sortOrder)}
            />
          </div>
          <Options
            options={[{
              text: 'Delete',
              icon: 'delete',
              color: 'warning',
              action: 'DELETE'
            }]}
            isOpen={isOptionsOpen}
            onToggle={onToggleActionsClicked}
            onOptionClicked={onActionClicked}
          />
        </div>
      </div>
      <div className="p-6">
        <FormContainer
          renderKey={`${block._id}-${block.blockType}`}
          schema={contentSchema}
          model={block}
          onUpdate={onEditBlockUpdate}
        />
        <FormContainer
          renderKey={`${block._id}-${block.blockType}`}
          schema={settingsSchema}
          model={block}
          onUpdate={onEditBlockUpdate}
        />
      </div>
    </div>
  );
};

export default EditBlock;