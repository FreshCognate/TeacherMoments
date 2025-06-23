import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

export default (feedbackItems) => {
  const run = getCache('run');

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: run.data.activeSlideRef });

  currentStage.feedbackItems = feedbackItems;
  return run.set({ stages });

}