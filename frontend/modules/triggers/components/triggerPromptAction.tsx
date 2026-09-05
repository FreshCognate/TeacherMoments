import React from 'react';
import Body from '~/uikit/content/components/body';
import Button from '~/uikit/buttons/components/button';

const TriggerPromptAction = ({
  stemsCount,
  onAddFeedbackClicked,
  onAddStemClicked,
}: {
  stemsCount: number;
  onAddFeedbackClicked: () => void,
  onAddStemClicked: () => void,
}) => {
  let body = stemsCount > 0 ? `You've added a prompt, would you like the user to branch to a stem?` : `You've added a prompt, would you like to give the user feedback based upon their answer or branch to stem?`
  return (
    <div className="w-full mx-auto bottom-40 bg-lm-2 dark:bg-dm-2 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="w-3/6">
        <Body
          body={body}
          size='sm'
          className="text-black/80 dark:text-white/80"
        />
      </div>
      <div className="flex items-center gap-x-4">
        {(stemsCount == 0) && (
          <Button text="Give feedback" icon="feedback" onClick={onAddFeedbackClicked} />
        )}
        <Button text="Branch to a stem" icon="branching" onClick={onAddStemClicked} />
      </div>
    </div>
  );
};

export default TriggerPromptAction;
