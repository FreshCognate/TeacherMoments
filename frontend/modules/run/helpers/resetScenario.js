import getCache from "~/core/cache/helpers/getCache";
import get from 'lodash/get';
import navigateTo from "./navigateTo";

export default ({ router }) => {
  const slides = getCache('slides');
  const run = getCache('run');
  run.set({});
  const firstSlideRef = get(slides, 'data.0.ref', null);
  navigateTo({ slideRef: firstSlideRef, router });
}