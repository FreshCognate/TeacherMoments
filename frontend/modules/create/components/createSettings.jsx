import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import editSlideSchema from '~/modules/slides/schemas/editSlideSchema';


const CreateSettings = ({
  slide,
  onSlideFormUpdate
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 w-full max-w-64 h-full">
      <div className="p-4">
        <FormContainer
          schema={editSlideSchema}
          model={slide}
          onUpdate={onSlideFormUpdate}
        />
      </div>
    </div>
  );
};

export default CreateSettings;