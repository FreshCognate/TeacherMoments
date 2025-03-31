import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Button from '~/uikit/buttons/components/button';
import Title from '~/uikit/content/components/title';

const ScenarioSettings = ({
  schema,
  scenario,
  isLoading,
  onUpdateScenario,
  onDeleteScenarioClicked
}) => {
  if (isLoading) return null;
  return (
    <div className="p-4 bg-lm-0 dark:bg-dm-0" style={{ marginTop: '28px' }}>
      <Title title="Scenario settings" />
      <div className="w-1/3">
        <FormContainer
          schema={schema}
          model={scenario}
          onUpdate={onUpdateScenario}
        />
      </div>
      <div className="border border-warning-regular dark:border-warning-light rounded  p-4 w-1/3">
        <Button text="Delete scenario" color="warning" onClick={onDeleteScenarioClicked} />
      </div>
    </div>
  );
};

export default ScenarioSettings;