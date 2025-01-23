import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';
import getIsSlideComplete from './getIsSlideComplete';
import trigger from "~/modules/triggers/helpers/trigger";

export default ({ slideRef, update }) => {
  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages);
  const currentStage = stages[stages.length - 1];

  extend(currentStage, update);

  // If update has isComplete we should see if the slide is complete as something big has happened
  if (update.isComplete) {
    setTimeout(() => {
      trigger({ triggerType: 'SLIDE', event: 'ON_COMPLETE', elementRef: slideRef }, {});
    }, 0);
  }

  return tracking.set({ stages });
}