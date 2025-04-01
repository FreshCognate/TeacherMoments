import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';

export default ({ blockRef }) => {
  const run = getCache('run');

  const currentStage = find(run.data.stages, { slideRef: run.data.activeSlideRef })
  const blocksByRef = currentStage.blocksByRef || {};
  return blocksByRef[blockRef] || {};

}