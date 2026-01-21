import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

export default (status) => {
  const run = getCache('run');

  const currentStage = find(run.data.stages, { slideRef: run.data.activeSlideRef });

  if (currentStage) {
    return currentStage.status;
  }

}