import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import trigger from "~/modules/triggers/helpers/trigger";
import find from 'lodash/find';

export default ({ slideRef }) => {
  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages);
  const currentStage = find(stages, { slideRef: tracking.data.activeSlideRef });


  if (!currentStage.isComplete) {
    currentStage.isComplete = true;
    currentStage.completedAt = new Date();
    setTimeout(() => {
      trigger({ triggerType: 'SLIDE', event: 'ON_COMPLETE', elementRef: slideRef }, {});
    }, 0);
    return tracking.set({ stages });
  }

}