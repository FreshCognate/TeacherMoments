import getCache from "~/core/cache/helpers/getCache";

export default ({ blockRef }) => {
  const tracking = getCache('tracking');

  console.log(tracking.data);

  const currentStage = tracking.data.stages[tracking.data.stages.length - 1];
  const currentBlockTracking = currentStage.blocksByRef[blockRef] || {};

  return currentBlockTracking;
}