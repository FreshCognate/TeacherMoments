import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default () => {
  const run = getCache('run');

  const {activeSlideId} = getScenarioDetails();

  const currentStage = find(run.data.stages, { slideRef: run.data.activeSlideRef });

  return currentStage;

}