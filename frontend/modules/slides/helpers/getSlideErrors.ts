import each from 'lodash/each';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import getBlockErrors from '~/modules/blocks/helpers/getBlockErrors';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';
import getStemErrors from '~/modules/stems/helpers/getStemErrors';
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

  if (slide.hasFeedback) {
    errors.push(...getSlideFeedbackErrors(slide));
  }

  each(blocks, block => {
    const blockErrors = getBlockErrors(block);
    errors.push(...blockErrors);
  });

  const stems = getStemsBySlideRef({ slideRef: slide.ref });

  each(stems, stem => {
    const stemErrors = getStemErrors(stem);
    errors.push(...stemErrors);
  });

  return errors;
};
