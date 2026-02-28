import React from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Button from '~/uikit/buttons/components/button';
import Title from '~/uikit/content/components/title';

const CohortSettings = ({
  schema,
  cohort,
  isLoading,
  onUpdateCohort,
  onDeleteCohortClicked
}: {
  schema: any,
  cohort: any,
  isLoading: boolean,
  onUpdateCohort: (payload: { update: any }) => void,
  onDeleteCohortClicked: () => void
}) => {
  if (isLoading) return null;
  return (
    <div className="p-4 bg-lm-0 dark:bg-dm-0 flex items-start" style={{ marginTop: '28px' }}>
      <div className="w-1/2 pr-12">
        <Title title="Cohort settings" />
        <div>
          <FormContainer
            schema={schema}
            model={cohort}
            onUpdate={onUpdateCohort}
          />
        </div>
        <div className="border border-warning-regular dark:border-warning-light rounded p-4">
          <Button text="Delete cohort" color="warning" onClick={onDeleteCohortClicked} />
        </div>
      </div>
    </div>
  );
};

export default CohortSettings;
