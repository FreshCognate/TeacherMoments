import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import filter from 'lodash/filter';
import getScenarioDetails from "./getScenarioDetails";
import navigateTo from "./navigateTo";

export default async ({ router }) => {

  const { activeSlideRef } = getScenarioDetails();

  if (activeSlideRef === 'SUMMARY') {
    const slides = getCache('slides').data;
    const rootStem = find(getCache('stems').data, { isRoot: true });
    const rootSlides = filter(slides, { stemRef: rootStem.ref });
    const maxSortOrder = Math.max(...rootSlides.map(s => s.sortOrder));
    const prevSlide = find(rootSlides, { sortOrder: maxSortOrder });
    if (prevSlide) {
      navigateTo({ slideRef: prevSlide.ref, router });
    }
    return;
  }

  const currentSlide = find(getCache('slides').data, { ref: activeSlideRef });

  if (currentSlide) {
    const currentStem = find(getCache('stems').data, { ref: currentSlide.stemRef });
    if (currentSlide.sortOrder === 0) {
      if (currentStem.isRoot) {
        navigateTo({ slideRef: 'CONSENT', router });
        return;
      }
      // If in nested stem - we should find the parent slide in the root stem
      navigateTo({ slideRef: currentStem.slideRef, router })
    }
    const prevSlide = find(getCache('slides').data, { stemRef: currentStem.ref, sortOrder: currentSlide.sortOrder - 1 });
    if (prevSlide) {
      navigateTo({ slideRef: prevSlide.ref, router });
    }
  }

}