import React from 'react';
import { Slide } from '~/modules/slides/slides.types';
import Button from '~/uikit/buttons/components/button';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const SlideActions = ({
  slide,
  doesSlideContainPrompts,
  onToggleFeedbackClicked,
  onEditFeedbackClicked
}: {
  slide: Slide,
  doesSlideContainPrompts: boolean,
  onToggleFeedbackClicked: (hasFeedback: boolean) => void;
  onEditFeedbackClicked: () => void;
}) => {
  if (!doesSlideContainPrompts) return null;

  return (
    <div className="w-full  max-w-screen-lg mx-auto" >
      <div className="bg-lm-1 dark:bg-dm-2 rounded-lg p-4 mx-8 mb-8">
        {slide.hasFeedback && (
          <div className="flex justify-between">
            <div className="w-1/2">
              <Body
                body={`You've got feedback turned on. You have ${slide.feedbackItems.length} feedback items setup.`}
                className="opacity-60 mb-4" />
              <FlatButton icon="edit" text="Edit feedback" onClick={onEditFeedbackClicked} />
            </div>
            <div>
              <Button
                text="Turn off feedback"
                onClick={() => onToggleFeedbackClicked(false)}
              />
            </div>
          </div>
        )}
        {!slide.hasFeedback && (
          <div className="flex justify-between">
            <div className="w-1/2">
              <Body
                body={`You've added a prompt. Would you like to give the user feedback based upon their answer?`}
                className="opacity-60" />
            </div>
            <div>
              <Button
                text="Turn on feedback"
                onClick={() => onToggleFeedbackClicked(true)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideActions;