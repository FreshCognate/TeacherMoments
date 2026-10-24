import each from 'lodash/each';
import filter from 'lodash/filter';
import maxBy from 'lodash/maxBy';
import getCache from '~/core/cache/helpers/getCache';
import getBlocksBySlideRef from '~/modules/blocks/helpers/getBlocksBySlideRef';
import getBlockErrors from '~/modules/blocks/helpers/getBlockErrors';
import getStemByRef from '~/modules/stems/helpers/getStemByRef';
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

  const stemSlides = filter(getCache('slides').data, { stemRef: slide.stemRef });
  const lastStemSlide = maxBy(stemSlides, 'sortOrder');

  if (lastStemSlide?._id === slide._id) {
    const stem = getStemByRef({ ref: slide.stemRef });
    if (stem) {
      errors.push(...getStemErrors(stem));
    }
  }

  return errors;
};
