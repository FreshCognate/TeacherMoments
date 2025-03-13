import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import EditSlideContainer from '~/modules/slides/containers/editSlideContainer';
import editSlideSchema from '~/modules/slides/schemas/editSlideSchema';


const CreateSettings = ({
  slideId,
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 w-full max-w-64 h-full">
      {(slideId) && (
        <EditSlideContainer
          slideId={slideId}
        />
      )}
    </div>
  );
};

export default CreateSettings;