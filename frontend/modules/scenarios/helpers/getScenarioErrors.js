import each from 'lodash/each';
import getCache from '~/core/cache/helpers/getCache';
import getSlideErrors from '~/modules/slides/helpers/getSlideErrors';
import getStemErrors from '~/modules/stems/helpers/getStemErrors';

export default () => {
  const errors = [];

  const stems = getCache('stems');

  each(stems.data, stem => {
    const stemErrors = getStemErrors(stem);
    errors.push(...stemErrors);
  });

  const slides = getCache('slides');

  each(slides.data, slide => {
    const slideErrors = getSlideErrors(slide);
    errors.push(...slideErrors);
  });


  return errors;
};
