import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default () => {

  const { activeSlideRef } = getScenarioDetails();

  if (activeSlideRef === 'CONSENT') {
    const nextSlide = find(getCache('slides').data, { sortOrder: 0 });
    return nextSlide;
  }

  const currentSlide = find(getCache('slides').data, { ref: activeSlideRef });

  if (currentSlide) {
    console.log(currentSlide);
    const currentStem = find(getCache('stems').data, { ref: currentSlide.stemRef });
    if (currentStem) {

      console.log(currentStem);
      const nextSlide = find(getCache('slides').data, { stemRef: currentStem.ref, sortOrder: currentSlide.sortOrder + 1 });
      console.log(nextSlide);
      if (nextSlide) {
        return nextSlide;
      }
      if (currentStem.isRoot) {
        return { _id: 'SUMMARY', slideType: 'SUMMARY', ref: 'SUMMARY' }
      } else {
        // if in nested stem, we should navigate back to the parent stem and the next slide
        const parentSlide = find(getCache('slides').data, { ref: currentStem.slideRef });
        const nextSlide = find(getCache('slides').data, { stemRef: parentSlide.stemRef, sortOrder: parentSlide.sortOrder + 1 });
        if (nextSlide) {
          return nextSlide;
        }
      }
    }
  }

}