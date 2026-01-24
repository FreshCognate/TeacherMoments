import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Title from '~/uikit/content/components/title';

const CreateStaticSlideEditor = ({
  schema,
  scenario,
  title,
  isLoading,
  onUpdate
}) => {
  if (isLoading) return null;
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Title title={title} className="mb-4" />
      <FormContainer
        schema={schema}
        model={scenario}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default CreateStaticSlideEditor;
