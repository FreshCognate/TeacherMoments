import getScenarioDetails from "~/modules/run/helpers/getScenarioDetails";
import getCurrentStemSlides from "./getCurrentStemSlides";
import getSelectedSlideSortOrder from "./getSelectedSlideSortOrder";

export default () => {
  const { activeSlideId } = getScenarioDetails();
  if (activeSlideId === 'CONSENT') return 0;
  if (activeSlideId === 'SUMMARY') return getCurrentStemSlides().length;
  return getSelectedSlideSortOrder() + 1;
}