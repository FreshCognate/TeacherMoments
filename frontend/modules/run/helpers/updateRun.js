import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';
import getIsSlideComplete from './getIsSlideComplete';
import trigger from "~/modules/triggers/helpers/trigger";
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

const debouncedSave = debounce(() => {
  if (isScenarioInPlay()) {
    const run = getCache('run');

    const stages = cloneDeep(run.data.stages);
    run.mutate({ stages }, { method: 'put' });
  }
}, 1000);

export default async ({ slideRef, blockRef, update }) => {

  const run = getCache('run');

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: run.data.activeSlideRef });

  const currentBlockTracking = currentStage.blocksByRef[blockRef] ? cloneDeep(currentStage.blocksByRef[blockRef]) : {};

  extend(currentBlockTracking, update);

  currentStage.blocksByRef[blockRef] = currentBlockTracking;

  // If update has isComplete we should see if the slide is complete as something big has happened
  if (update.isComplete) {
    const isSlideComplete = getIsSlideComplete({ blocksByRef: currentStage.blocksByRef });
    if (isSlideComplete && !currentStage.isComplete) {
      currentStage.isComplete = true;
      currentStage.completedAt = new Date();
    }
  }

  debouncedSave({ run, stages });

  return run.set({ stages });

}