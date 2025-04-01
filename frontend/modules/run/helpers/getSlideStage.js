import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default () => {
  const run = getCache('run');

  const currentStage = find(run.data.stages, { slideRef: run.data.activeSlideRef });

  return currentStage;

}