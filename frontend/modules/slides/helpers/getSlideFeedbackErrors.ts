import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import getBlockDisplayType from '~/modules/blocks/helpers/getBlockDisplayType';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import hasContent from '~/modules/ls/helpers/hasContent';
import { Slide } from '../slides.types';

type SlideFeedbackError = {
  message: string,
  elementType: string,
  elementId: string
};

export default (slide: Slide) => {
  const errors: SlideFeedbackError[] = [];
  const defaultError = { elementType: 'SLIDE', elementId: slide._id };

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });
  const promptBlocks = filter(blocks, block => getBlockDisplayType(block) === 'PROMPT');

  if (!promptBlocks.length) {
    errors.push({ ...defaultError, message: 'Slide has no prompt blocks to base conditions on' });
  }

  const feedbackItemsWithoutConditions = filter(slide.feedbackItems, feedbackItem => !feedbackItem.conditions?.length);
  if (feedbackItemsWithoutConditions.length > 1) {
    errors.push({ ...defaultError, message: 'Only one feedback item can have no conditions' });
  }

  each(slide.feedbackItems, (feedbackItem, index) => {
    console.log(feedbackItem);
    if (!hasContent(feedbackItem, 'body')) {
      errors.push({ ...defaultError, message: `Feedback item ${index + 1} has no content` });
    }

    each(feedbackItem.conditions, condition => {
      each(condition.prompts, prompt => {
        if (!prompt.ref) {
          errors.push({ ...defaultError, message: 'Condition has no prompt selected' });
          return;
        }

        const block = find(blocks, { ref: prompt.ref });
        if (!block) {
          errors.push({ ...defaultError, message: 'Condition references a block that no longer exists' });
          return;
        }

        if (block.blockType === 'INPUT_PROMPT') {
          console.log('takaaaaa')
          if (!prompt.text?.trim()) {
            errors.push({ ...defaultError, message: 'Input prompt condition needs text' });
          }
        }

        if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {
          if (!prompt.options?.length) {
            errors.push({ ...defaultError, message: 'Multiple choice condition needs options selected' });
          }
        }
      });
    });
  });

  return errors;
};
