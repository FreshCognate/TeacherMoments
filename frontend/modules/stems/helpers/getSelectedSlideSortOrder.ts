import getScenarioDetails from "~/modules/run/helpers/getScenarioDetails";
import find from 'lodash/find';
import getCache from "~/core/cache/helpers/getCache";

export default () => {
  const { activeSlideId } = getScenarioDetails();
  const slides = getCache('slides');
  return find(slides.data, { _id: activeSlideId }).sortOrder;
}