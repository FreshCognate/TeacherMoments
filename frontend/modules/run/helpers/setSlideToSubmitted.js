import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

export default () => {
  const run = getCache('run');

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: run.data.activeSlideRef });


  if (!currentStage.isSubmitted) {
    currentStage.isSubmitted = true;
    return run.set({ stages });
  }

}