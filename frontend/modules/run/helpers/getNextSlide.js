import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";
import getRootStem from "~/modules/stems/helpers/getRootStem";

export default () => {

  const { activeSlideRef } = getScenarioDetails();


  if (activeSlideRef === 'CONSENT') {
    const rootStem = getRootStem();
    const nextSlide = find(getCache('slides').data, { sortOrder: 0, stemRef: rootStem.ref });
    return nextSlide;
  }

  const currentSlide = find(getCache('slides').data, { ref: activeSlideRef });

  if (currentSlide) {
    const currentStem = find(getCache('stems').data, { ref: currentSlide.stemRef });
    if (currentStem) {

      const nextSlide = find(getCache('slides').data, { stemRef: currentStem.ref, sortOrder: currentSlide.sortOrder + 1 });
      if (nextSlide) {
        return nextSlide;
      }
    }
  }

}