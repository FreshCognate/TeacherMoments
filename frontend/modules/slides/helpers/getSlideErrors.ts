import each from 'lodash/each';
import filter from 'lodash/filter';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import getBlockErrors from '~/modules/blocks/helpers/getBlockErrors';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';
import getTriggersBySlideRef from '~/modules/triggers/helpers/getTriggersBySlideRef';
import getSlideFeedbackErrors from './getSlideFeedbackErrors';
import { Slide } from '../slides.types';

type SlideError = {
  message: string,
  elementType: string,
  elementId: string
};

export default (slide: Slide) => {
  const errors: SlideError[] = [];

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });
  if (!blocks?.length) {
    errors.push({ message: 'Slide has no blocks', elementType: 'SLIDE', elementId: slide._id });
  }

  const stems = getStemsBySlideRef({ slideRef: slide.ref });

  if (stems.length > 0) {
    const triggers = getTriggersBySlideRef({ slideRef: slide.ref });
    const branchingTriggers = filter(triggers, { action: 'BRANCH_TO_STEM_FROM_PROMPTS' });
    if (branchingTriggers.length === 0) {
      errors.push({ message: 'Slide with stems has no branching trigger', elementType: 'SLIDE_TRIGGER', elementId: slide._id });
    }
  }

  if (slide.hasFeedback) {
    errors.push(...getSlideFeedbackErrors(slide));
  }

  each(blocks, block => {
    const blockErrors = getBlockErrors(block);
    errors.push(...blockErrors);
  });

  return errors;
};
