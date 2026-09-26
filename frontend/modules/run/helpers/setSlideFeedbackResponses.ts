import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default (feedbackResponses: string[]) => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: activeSlideRef });

  currentStage.feedbackResponses = feedbackResponses;

  if (isScenarioInPlay()) {
    if (run.mutate) {
      return run.mutate({ stages }, { method: 'put' });
    }
  }

  return run.set({ stages });

}