import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';
import trigger from "~/modules/triggers/helpers/trigger";
import find from 'lodash/find';

export default ({ slideRef, update }) => {
  const run = getCache('run');

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: run.data.activeSlideRef });

  extend(currentStage, update);

  // If update has isComplete we should see if the slide is complete as something big has happened
  if (update.isComplete) {
    setTimeout(() => {
      trigger({ triggerType: 'SLIDE', event: 'ON_COMPLETE', elementRef: slideRef }, {});
    }, 0);
  }

  return run.set({ stages });
}