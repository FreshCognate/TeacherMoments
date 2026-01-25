import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default () => {
  const run = getCache('run');

  const { activeSlideRef } = getScenarioDetails();

  const currentStage = find(run.data.stages, { slideRef: activeSlideRef });

  return currentStage;

}