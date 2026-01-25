import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default () => {

  const { activeSlideRef } = getScenarioDetails();

  if (activeSlideRef === 'CONSENT') {
    const nextSlide = find(getCache('slides').data, {sortOrder: 0});
    return nextSlide;
  }

  const currentSlide = find(getCache('slides').data, { ref: activeSlideRef });

  if (currentSlide) {
    const nextSlide = find(getCache('slides').data, { sortOrder: currentSlide.sortOrder + 1 });
    if (nextSlide) {
      return nextSlide;
    }
    return {_id: 'SUMMARY', slideType: 'SUMMARY', ref: 'SUMMARY'}
  }

}