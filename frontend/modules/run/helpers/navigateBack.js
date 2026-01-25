import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";
import navigateTo from "./navigateTo";

export default async ({router}) => {

  const { activeSlideRef } = getScenarioDetails();

  if (activeSlideRef === 'SUMMARY') {
    const slides = getCache('slides').data;
    const maxSortOrder = Math.max(...slides.map(s => s.sortOrder));
    const prevSlide = find(slides, {sortOrder: maxSortOrder});
    if (prevSlide) {
      navigateTo({slideRef: prevSlide.ref, router});
    }
    return;
  }

  const currentSlide = find(getCache('slides').data, { ref: activeSlideRef });

  if (currentSlide) {
    if (currentSlide.sortOrder === 0) {
      navigateTo({slideRef: 'CONSENT', router});
      return;
    }
    const prevSlide = find(getCache('slides').data, { sortOrder: currentSlide.sortOrder - 1 });
    if (prevSlide) {
      navigateTo({slideRef: prevSlide.ref, router});
    }
  }

}