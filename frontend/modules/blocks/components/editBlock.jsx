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

  const className = classnames("w-full bg-lm-0 shadow dark:bg-dm-0 rounded-lg mb-8", {
    "opacity-50": isDeleting
  })
  return (
    <div className={className}
    >
      <div className="flex justify-between items-center py-2 px-4">
        <div>
          <Badge text={getBlockDisplayName(block)} className="border border-lm-2 dark:border-dm-2" />
        </div>
        <div className="flex items-center">
          <div className="flex items-center bg-lm-0 dark:bg-dm-0 rounded-lg mr-4">
            <FlatButton
              icon="sortUp"
              className="p-2"
              title="Sort up"
              isDisabled={!canSortUp}
              onClick={() => onSortUpClicked(block.sortOrder)}
            />
            <FlatButton
              icon="sortDown"
              className=" p-2"
              title="Sort down"
              isDisabled={!canSortDown}
              onClick={() => onSortDownClicked(block.sortOrder)}
            />
          </div>
          <Options
            options={[{
              text: 'Delete block',
              icon: 'delete',
              color: 'warning',
              action: 'DELETE'
            }]}
            title="Block options"
            isOpen={isOptionsOpen}
            onToggle={onToggleActionsClicked}
            onOptionClicked={onActionClicked}
          />
        </div>
      </div>
      <div className="flex h-full items-stretch">

        <div className="p-6 flex-grow">
          <FormContainer
            renderKey={`${block._id}-${block.blockType}`}
            schema={contentSchema}
            model={block}
            onUpdate={onEditBlockUpdate}
          />
        </div>
        <div className="p-6  bg-lm-2/60 dark:bg-dm-2/60 w-80 min-w-80">
          <FormContainer
            renderKey={`${block._id}-${block.blockType}`}
            schema={settingsSchema}
            model={block}
            onUpdate={onEditBlockUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default EditBlock;