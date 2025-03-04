import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';
import trigger from "~/modules/triggers/helpers/trigger";
import find from 'lodash/find';

export default ({ slideRef, update }) => {
  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages);
  const currentStage = find(stages, { slideRef: tracking.data.activeSlideRef });

  extend(currentStage, update);

  // If update has isComplete we should see if the slide is complete as something big has happened
  if (update.isComplete) {
    setTimeout(() => {
      trigger({ triggerType: 'SLIDE', event: 'ON_COMPLETE', elementRef: slideRef }, {});
    }, 0);
  }

  return tracking.set({ stages });
}