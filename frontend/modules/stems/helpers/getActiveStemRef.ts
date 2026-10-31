import getCache from "~/core/cache/helpers/getCache";
import getScenarioDetails from "~/modules/run/helpers/getScenarioDetails";
import find from 'lodash/find';
import last from 'lodash/last';
import getRootStem from "./getRootStem";

export default () => {
  const { activeSlideId } = getScenarioDetails();
  if (activeSlideId === 'SUMMARY') {
    const summaryStemRef = last(getCache('editor').data?.stemPath);
    if (summaryStemRef) return summaryStemRef;
  }
  const slides = getCache('slides');
  const activeSlide = find(slides.data, { _id: activeSlideId });
  if (activeSlide?.stemRef) return activeSlide.stemRef;
  const rootStem = getRootStem();
  if (rootStem) return rootStem.ref;
  return null;
}
