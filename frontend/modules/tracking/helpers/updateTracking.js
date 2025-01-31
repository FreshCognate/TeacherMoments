import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';
import getIsSlideComplete from './getIsSlideComplete';
import trigger from "~/modules/triggers/helpers/trigger";

export default async ({ slideRef, blockRef, update }) => {

  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages);
  const currentStage = stages[stages.length - 1];

  const currentBlockTracking = currentStage.blocksByRef[blockRef] ? cloneDeep(currentStage.blocksByRef[blockRef]) : {};

  extend(currentBlockTracking, update);

  currentStage.blocksByRef[blockRef] = currentBlockTracking;

  // If update has isComplete we should see if the slide is complete as something big has happened
  if (update.isComplete) {
    const isSlideComplete = getIsSlideComplete({ blocksByRef: currentStage.blocksByRef });
    if (isSlideComplete && !currentStage.isComplete) {
      currentStage.isComplete = true;
      currentState.completedAt = new Date();
      setTimeout(() => {
        trigger({ triggerType: 'SLIDE', event: 'ON_COMPLETE', elementRef: slideRef }, {});
      }, 0);
    }
  }

  return tracking.set({ stages });

}