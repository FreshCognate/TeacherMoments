import getCache from '~/core/cache/helpers/getCache';
import find from 'lodash/find';

export default () => {
  const searchParams = new URLSearchParams(window.location.search);
  const activeSlideRef = searchParams.get('slide');

  let activeSlideId = null;

  if (activeSlideRef === 'CONSENT' || activeSlideRef === 'SUMMARY') {
    activeSlideId = activeSlideRef;
  } else {
    const slides = getCache('slides');
    const activeSlide = find(slides?.data, { ref: activeSlideRef });
    activeSlideId = activeSlide?._id || null;
  }

  return {
    activeSlideRef,
    activeSlideId
  }
}