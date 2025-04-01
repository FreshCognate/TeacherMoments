import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import trigger from "~/modules/triggers/helpers/trigger";
import find from 'lodash/find';

export default ({ slideRef }) => {
  const run = getCache('run');

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: run.data.activeSlideRef });


  if (!currentStage.isComplete) {
    currentStage.isComplete = true;
    setTimeout(() => {
      trigger({ triggerType: 'SLIDE', event: 'ON_COMPLETE', elementRef: slideRef }, {});
    }, 0);
    return run.set({ stages });
  }

}