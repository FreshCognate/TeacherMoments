import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import trigger from "~/modules/triggers/helpers/trigger";
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import getScenarioDetails from "./getScenarioDetails";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default ({ slideRef }) => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: activeSlideRef });


  if (!currentStage.isComplete) {
    currentStage.isComplete = true;
    currentStage.completedAt = new Date();

    forEach(currentStage.blocksByRef, (blockTracking) => {
      blockTracking.isComplete = true;
    });

    if (isScenarioInPlay()) {
      return run.mutate({ stages }, { method: 'put' });
    }

    return run.set({ stages });
  }

}