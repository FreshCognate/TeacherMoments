import each from 'lodash/each';
import getCache from '~/core/cache/helpers/getCache';
import getSlideErrors from '~/modules/slides/helpers/getSlideErrors';
import getTriggerErrors from '~/modules/triggers/helpers/getTriggerErrors';
import getTriggersBySlideRef from '~/modules/triggers/helpers/getTriggersBySlideRef';

export default () => {
  const errors = [];

  const slides = getCache('slides');

  each(slides.data, slide => {
    const slideErrors = getSlideErrors(slide);
    errors.push(...slideErrors);

    const slideTriggers = getTriggersBySlideRef({ slideRef: slide.ref });
    each(slideTriggers, trigger => {
      const triggerErrors = getTriggerErrors(trigger);
      errors.push(...triggerErrors);
    });
  });

  return errors;
};
