import React from 'react';
import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';

const ShareScenario = ({
  scenario,
  publishLink,
  isPublishing,
  hasCopied,
  onPublishScenarioClicked,
  onCopyLinkClicked
}) => {
  return (
    <div style={{ marginTop: '28px' }} >
      <div className="p-2 flex items-center justify-between bg-lm-0 dark:bg-dm-1 border border-lm-3 dark:border-dm-1 rounded-lg">
        <div className="flex items-center">
          {(scenario.isPublished) && (
            <>
              <Button text="Copy link" className="mr-2" onClick={onCopyLinkClicked} />
              <div className="bg-lm-1 dark:bg-dm-2 py-1 px-4 rounded-md">
                {`${publishLink}`}
              </div>
              {(hasCopied) && (
                <>
                  <Icon icon="copy" size={16} className="ml-2 mr-1 text-primary-regular/60 dark:text-primary-light/60" />
                  <Body className="text-primary-regular/60 dark:text-primary-light/60" body="Copied!" size="xs" />
                </>
              )}
            </>
          )}
        </div>
        <div className="flex items-center">
          <div>
            {(!isPublishing && scenario.hasChanges) && (
              <Body className="text-black/60 dark:text-white/60" body="This scenario has draft changes that have not been published." size="xs" />
            )}
            {(!isPublishing && !scenario.hasChanges) && (
              <Body className="text-black/60 dark:text-white/60" body="All changes are published." size="xs" />
            )}
            {(isPublishing) && (
              <Body className="text-black/60 dark:text-white/60" body="Publishing..." size="xs" />
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
    </div>
  );
};

export default ShareScenario;