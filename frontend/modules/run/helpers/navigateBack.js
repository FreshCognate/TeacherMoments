import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import getScenarioDetails from "./getScenarioDetails";
import navigateTo from "./navigateTo";
import getParentStemSlide from "./getParentStemSlide";

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
      const parentStemSlide = getParentStemSlide({ stem: currentStem });
      if (parentStemSlide) {
        navigateTo({ slideRef: parentStemSlide.ref, router });
      }
      return;
    }

    const run = getCache('run');
    const currentRunStageIndex = findIndex(run.data.stages, {
      slideRef: activeSlideRef
    })

    const previousRunStage = run.data.stages[currentRunStageIndex - 1];

    if (previousRunStage) {
      navigateTo({ slideRef: previousRunStage.slideRef, router });
      return;
    }
    const prevSlide = find(getCache('slides').data, { stemRef: currentStem.ref, sortOrder: currentSlide.sortOrder - 1 });
    if (prevSlide) {
      navigateTo({ slideRef: prevSlide.ref, router });
    }
  }

}