import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default (feedbackItems) => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: activeSlideRef });

  currentStage.feedbackItems = feedbackItems;
  return run.set({ stages });

}