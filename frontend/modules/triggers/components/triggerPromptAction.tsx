import React from 'react';
import Body from '~/uikit/content/components/body';
import Button from '~/uikit/buttons/components/button';

const TriggerPromptAction = ({
  onAddFeedbackClicked,
  onAddStemClicked,
}: {
  onAddFeedbackClicked: () => void,
  onAddStemClicked: () => void,
}) => {
  return (
    <div className="w-full mx-auto bottom-40 bg-lm-2 dark:bg-dm-2 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="w-3/6">
        <Body
          body={`You've added a prompt, would you like to give the user feedback based upon their answer or branch to stem?`}
          className="text-black/80 dark:text-white/80"
        />
      </div>
      <div className="flex items-center gap-x-4">
        <Button text="Give feedback" icon="feedback" onClick={onAddFeedbackClicked} />
        <Button text="Branch to a stem" icon="branch" onClick={onAddStemClicked} />
      </div>
    </div>
  );
};

export default TriggerPromptAction;
