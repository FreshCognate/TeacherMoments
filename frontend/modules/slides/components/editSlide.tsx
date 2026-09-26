import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import { Slide } from '../slides.types';

const EditSlide = ({
  schema,
  slide,
  onSlideFormUpdate
}: {
  schema: any,
  slide: Slide,
  onSlideFormUpdate: (payload: { update: Partial<Slide> }) => void
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