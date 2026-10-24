import each from 'lodash/each';
import getCache from '~/core/cache/helpers/getCache';
import getSlideErrors from '~/modules/slides/helpers/getSlideErrors';

export default () => {
  const errors = [];

  const slides = getCache('slides');

  each(slides.data, slide => {
    const slideErrors = getSlideErrors(slide);
    errors.push(...slideErrors);
  });

  return errors;
};
