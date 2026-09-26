import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import { Slide } from '../slides.types';

const EditSlideFeedback = ({
  schema,
  slide,
  onSlideUpdate
}: {
  schema: any,
  slide: Slide,
  onSlideUpdate: (payload: { update: Partial<Slide> }) => void
}) => {
  return (
    <div className="p-8">
      <FormContainer
        schema={schema}
        model={slide}
        onUpdate={onSlideUpdate}
      />
    </div>
  );
};

export default EditSlideFeedback;