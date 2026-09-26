import React from 'react';
import { Slide } from '~/modules/slides/slides.types';
import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';

const SlideActions = ({
  slide,
  doesSlideContainPrompts,
  onTurnOnFeedbackClicked
}: {
  slide?: Slide,
  doesSlideContainPrompts: boolean,
  onTurnOnFeedbackClicked: () => void;
}) => {
  if (!doesSlideContainPrompts) return null;
  if (slide?.hasFeedback) return null;
  return (
    <div className="flex justify-between bg-lm-1 dark:bg-dm-2 rounded-lg p-4 m-8">
      <Body
        body={`You've added a prompt. Would you like to give the user feedback based upon their answer?`}
        className="w-2/3 opacity-60" />
      <Button
        text="Turn on feedback"
        onClick={onTurnOnFeedbackClicked}
      />
    </div>
  );
};

export default SlideActions;