import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import trigger from "~/modules/triggers/helpers/trigger";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default (shouldStopNavigation) => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: activeSlideRef });


  currentStage.shouldStopNavigation = shouldStopNavigation;

  return run.set({ stages });

}