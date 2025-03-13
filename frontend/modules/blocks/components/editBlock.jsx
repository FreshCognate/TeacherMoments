import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import classnames from 'classnames';
import Options from '~/uikit/dropdowns/components/options';

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
  const className = classnames("w-full bg-lm-2 dark:bg-dm-1 p-10 rounded-lg mb-8 relative", {
    "opacity-50": isDeleting
  })
  return (
    <div className={className}
    >
      <div className="absolute top-4 right-4">
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
      <FormContainer
        renderKey={`${block._id}-${block.blockType}-${random}`}
        schema={schema}
        model={block}
        onUpdate={onEditBlockUpdate}
      />
    </div>
  );
};

export default EditBlock;