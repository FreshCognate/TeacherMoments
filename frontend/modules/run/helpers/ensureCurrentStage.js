import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import getScenarioDetails from "./getScenarioDetails";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";
import createStageForSlide from "./createStageForSlide";

export default function ensureCurrentStage() {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  if (!activeSlideRef) {
    return null;
  }

  const stages = run.data?.stages || [];
  let currentStage = find(stages, { slideRef: activeSlideRef });

  if (!currentStage) {
    currentStage = createStageForSlide(activeSlideRef);

    const newStages = cloneDeep(stages);
    newStages.push(currentStage);

    if (isScenarioInPlay()) {
      run.mutate({ stages: newStages }, { method: 'put' });
    } else {
      run.set({ stages: newStages });
    }
  }

  return currentStage;
}
