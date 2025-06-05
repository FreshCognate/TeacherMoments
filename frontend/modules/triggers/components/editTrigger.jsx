import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';

const EditTrigger = ({
  schema,
  model,
  onFormUpdate
}) => {
  return (
    <div className="p-4">
      <FormContainer
        schema={schema}
        model={model}
        onUpdate={onFormUpdate}
      />
    </div>
  );
};

export default EditTrigger;