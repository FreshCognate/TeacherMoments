import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Button from '~/uikit/buttons/components/button';
import Title from '~/uikit/content/components/title';
import ScenarioCollaboratorsContainer from '../containers/scenarioCollaboratorsContainer';

const ScenarioSettings = ({
  schema,
  scenario,
  isLoading,
  onUpdateScenario,
  onDeleteScenarioClicked
}) => {
  if (isLoading) return null;
  return (
    <div className="p-4 bg-lm-0 dark:bg-dm-0 flex items-start" style={{ marginTop: '28px' }}>
      <div className="w-1/2 pr-12 border-r border-r-lm-2 dark:border-r-dm-2">

        <Title title="Scenario settings" />
        <div >
          <FormContainer
            schema={schema}
            model={scenario}
            onUpdate={onUpdateScenario}
          />
        </div>
        <div className="border border-warning-regular dark:border-warning-light rounded  p-4">
          <Button text="Delete scenario" color="warning" onClick={onDeleteScenarioClicked} />
        </div>
      </div>
      <div className="p-8 pl-12 w-1/2">
        <Title title="Collaborators" />
        <ScenarioCollaboratorsContainer />
      </div>
    </div>
  );
};

export default ScenarioSettings;