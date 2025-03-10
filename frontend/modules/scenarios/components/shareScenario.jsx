import React from 'react';
import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';

const ShareScenario = ({
  scenario,
  isPublishing,
  onPublishScenarioClicked
}) => {
  return (
    <div style={{ marginTop: '28px' }} >
      <div className="p-2 flex items-center justify-end bg-lm-0 dark:bg-dm-2">
        <div>
          {(!isPublishing && scenario.hasChanges) && (
            <Body className="text-black/60 dark:text-white/60" body="This scenario has draft changes that have not been published." size="sm" />
          )}
          {(isPublishing) && (
            <Body className="text-black/60 dark:text-white/60" body="Publishing..." size="sm" />
          )}
        </div>
        <Button
          text="Publish"
          color="primary"
          className="ml-4"
          isDisabled={isPublishing}
          onClick={onPublishScenarioClicked}
        />
      </div>
    </div>
  );
};

export default ShareScenario;