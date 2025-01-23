import getCache from "~/core/cache/helpers/getCache";

export default () => {
  const tracking = getCache('tracking');

  const currentStage = tracking.data.stages[tracking.data.stages.length - 1];

  return currentStage;

}