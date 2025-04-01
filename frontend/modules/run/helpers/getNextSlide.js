import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default () => {
  const run = getCache('run');

  const activeSlideRef = run.data.activeSlideRef;

  const currentSlide = find(getCache('slides').data, { ref: activeSlideRef });

  if (currentSlide) {
    const nextSlide = find(getCache('slides').data, { sortOrder: currentSlide.sortOrder + 1 });
    return nextSlide;
  }

}