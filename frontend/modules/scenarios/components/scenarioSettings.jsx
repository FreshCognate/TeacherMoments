import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Title from '~/uikit/content/components/title';

const ScenarioSettings = ({
  scenario,
  onUpdateScenario
}) => {
  return (
    <div className="p-4">
      <Title title="Scenario settings" />
      <div>
        <FormContainer
          schema={{
            name: {
              type: 'Text',
              label: 'Name'
            }
          }}
          model={scenario}
          onUpdate={onUpdateScenario}
        />
      </div>
    </div>
  );
};

export default ScenarioSettings;