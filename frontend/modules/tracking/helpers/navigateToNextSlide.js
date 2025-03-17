import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import navigateTo from "./navigateTo";

export default async () => {

  const tracking = getCache('tracking');

  const activeSlideRef = tracking.data.activeSlideRef;

  const currentSlide = find(getCache('slides').data, { ref: activeSlideRef });

  const nextSlide = find(getCache('slides').data, { sortOrder: currentSlide.sortOrder + 1 });

  navigateTo({ slideRef: nextSlide.ref });

}