import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import FlatButton from '~/uikit/buttons/components/flatButton';

const EditBlock = ({
  schema,
  block,
  onEditBlockUpdate,
}) => {
  const random = Math.random();
  return (
    <div className="w-full bg-lm-2 dark:bg-dm-1 p-10 rounded-lg mb-8"
    >
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