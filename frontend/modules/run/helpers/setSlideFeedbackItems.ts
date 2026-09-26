import getCache from "~/core/cache/helpers/getCache";
import getScenarioDetails from "./getScenarioDetails";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";
import { StageFeedbackItem } from "../runs.types";

export default (feedbackItems: StageFeedbackItem[]) => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: activeSlideRef });

  currentStage.feedbackItems = feedbackItems;

  if (isScenarioInPlay()) {
    if (run.mutate) {
      return run.mutate({ stages }, { method: 'put' });
    }
  }

  return run.set({ stages });
}