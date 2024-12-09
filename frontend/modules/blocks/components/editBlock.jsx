import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';

const EditBlock = ({
  schema,
  block,
  onEditBlockUpdate
}) => {
  return (
    <div className="p-4">
      <FormContainer
        schema={schema}
        model={block}
        onUpdate={onEditBlockUpdate}
      />
    </div>
  );
};

export default EditBlock;