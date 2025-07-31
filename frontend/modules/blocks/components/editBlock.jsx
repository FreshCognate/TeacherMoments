import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import classnames from 'classnames';
import Options from '~/uikit/dropdowns/components/options';
import getBlockDisplayName from '../helpers/getBlockDisplayName';
import Badge from '~/uikit/badges/components/badge';
import FlatButton from '~/uikit/buttons/components/flatButton';

const EditBlock = ({
  renderKey,
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

  const className = classnames("w-full bg-lm-0 shadow-sm border-2 border-lm-3 dark:border-dm-2 dark:bg-dm-0 rounded-lg mb-8", {
    "opacity-50": isDeleting
  })
  return (
    <div className={className}
    >
      <div className="flex h-full items-stretch">

        <div className="flex-grow">
          <div className="px-6 h-14 flex items-center">
            <div className="flex">
              <Badge text={getBlockDisplayName(block)} className="border border-lm-2 dark:border-dm-2" />
            </div>
          </div>
          <div className="px-6 py-2">
            <FormContainer
              renderKey={`${block._id}-${block.blockType}-${renderKey}`}
              schema={contentSchema}
              model={block}
              onUpdate={onEditBlockUpdate}
            />
          </div>
        </div>
        <div className=" bg-lm-1 dark:bg-dm-1 w-96 min-w-96 rounded-r-lg">
          <div className="flex items-center justify-end px-6 h-14">
            <div className="flex items-center bg-lm-2 border border-lm-3 dark:border-none dark:bg-dm-2 rounded-lg mr-4">
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
          <div className="px-6 py-2">
            <FormContainer
              renderKey={`${block._id}-${block.blockType}-${renderKey}`}
              schema={settingsSchema}
              model={block}
              onUpdate={onEditBlockUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlock;