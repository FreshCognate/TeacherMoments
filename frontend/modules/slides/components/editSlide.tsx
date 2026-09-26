import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';

const EditSlide = ({
  schema,
  slide,
  onSlideFormUpdate
}) => {
  return (
    <div className="p-4">
      <FormContainer
        schema={schema}
        model={slide}
        onUpdate={onSlideFormUpdate}
      />
    </div>
  );
};

export default EditSlide;