import getCache from "~/core/cache/helpers/getCache";
import get from 'lodash/get';
import navigateTo from "./navigateTo";

export default () => {
  const slides = getCache('slides');
  const tracking = getCache('tracking');
  tracking.set({});
  const firstSlideRef = get(slides, 'data.0.ref', null);
  navigateTo({ slideRef: firstSlideRef });
}