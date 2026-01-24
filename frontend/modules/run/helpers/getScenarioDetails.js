import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default () => {
  const searchParams = new URLSearchParams(window.location.search);
  const activeSlideId = searchParams.get('slide');
  let activeSlideRef;
  
  if (activeSlideId) {
    const slides = getCache('slides').data;
    const activeSlide = find(slides, {_id: activeSlideId});
    if (activeSlide) {
      activeSlideRef = activeSlide.ref;
    }
  }
  
  return {
    activeSlideId,
    activeSlideRef
  }
}