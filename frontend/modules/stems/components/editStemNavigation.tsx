import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import { Stem } from '../stems.types';

const EditStemNavigation = ({
  schema,
  stem,
  onStemUpdate
}: {
  schema: any,
  stem: Stem,
  onStemUpdate: (payload: { update: Partial<Stem> }) => void
}) => {
  return (
    <div className="p-8">
      <FormContainer
        schema={schema}
        model={stem}
        onUpdate={onStemUpdate}
      />
    </div>
  );
};

export default EditStemNavigation;