import each from 'lodash/each';
import getCache from '~/core/cache/helpers/getCache';
import getIsSlideValid from '~/modules/slides/helpers/getIsSlideValid';
import getIsTriggerValid from '~/modules/triggers/helpers/getIsTriggerValid';
import getTriggersBySlideRef from '~/modules/triggers/helpers/getTriggersBySlideRef';

export default () => {
  const errors = [];

  const slides = getCache('slides');

  each(slides.data, slide => {
    const slideErrors = getIsSlideValid(slide);
    errors.push(...slideErrors);

    const slideTriggers = getTriggersBySlideRef({ slideRef: slide.ref });
    each(slideTriggers, trigger => {
      const triggerErrors = getIsTriggerValid(trigger);
      errors.push(...triggerErrors);
    });
  });

  return errors;
};
