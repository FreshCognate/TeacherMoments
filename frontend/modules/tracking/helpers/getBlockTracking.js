import getCache from "~/core/cache/helpers/getCache";

export default ({ blockRef }) => {
  const tracking = getCache('tracking');

  const currentStage = tracking.data.stages[tracking.data.stages.length - 1];
  const currentBlockTracking = currentStage.blocksByRef[blockRef] || {};

  return currentBlockTracking;
}