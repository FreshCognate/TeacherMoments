import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Title from '~/uikit/content/components/title';

const ScenarioSettings = ({
  schema,
  scenario,
  isLoading,
  onUpdateScenario
}) => {
  if (isLoading) return null;
  return (
    <div className="p-4">
      <Title title="Scenario settings" />
      <div className="w-1/3">
        <FormContainer
          schema={schema}
          model={scenario}
          onUpdate={onUpdateScenario}
        />
      </div>
    </div>
  );
};

export default ScenarioSettings;