import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import classnames from 'classnames';
import Options from '~/uikit/dropdowns/components/options';
import getBlockDisplayName from '../helpers/getBlockDisplayName';
import Badge from '~/uikit/badges/components/badge';

const EditBlock = ({
  schema,
  block,
  isOptionsOpen,
  isDeleting,
  onEditBlockUpdate,
  onToggleActionsClicked,
  onActionClicked,
}) => {
  const random = Math.random();
  const className = classnames("w-full bg-lm-2 dark:bg-dm-1 p-4 rounded-lg mb-8", {
    "opacity-50": isDeleting
  })
  return (
    <div className={className}
    >
      <div className="flex justify-between">
        <div>
          <Badge text={getBlockDisplayName(block)} className="border border-lm-2 dark:border-dm-2" />
        </div>
        <div>
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
          renderKey={`${block._id}-${block.blockType}-${random}`}
          schema={schema}
          model={block}
          onUpdate={onEditBlockUpdate}
        />
      </div>
    </div>
  );
};

export default EditBlock;