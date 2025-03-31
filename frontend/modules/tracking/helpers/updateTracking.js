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
    const tracking = getCache('tracking');

    const stages = cloneDeep(tracking.data.stages);
    tracking.mutate({ stages }, { method: 'put' });
  }
}, 1000);

export default async ({ slideRef, blockRef, update }) => {

  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages);
  const currentStage = find(stages, { slideRef: tracking.data.activeSlideRef });

  const currentBlockTracking = currentStage.blocksByRef[blockRef] ? cloneDeep(currentStage.blocksByRef[blockRef]) : {};

  extend(currentBlockTracking, update);

  currentStage.blocksByRef[blockRef] = currentBlockTracking;

  // If update has isComplete we should see if the slide is complete as something big has happened
  if (update.isComplete) {
    const isSlideComplete = getIsSlideComplete({ blocksByRef: currentStage.blocksByRef });
    if (isSlideComplete && !currentStage.isComplete) {
      currentStage.isComplete = true;
      currentStage.completedAt = new Date();
      setTimeout(() => {
        trigger({ triggerType: 'SLIDE', event: 'ON_COMPLETE', elementRef: slideRef }, {});
      }, 0);
    }
  }

  debouncedSave({ tracking, stages });

  return tracking.set({ stages });

}