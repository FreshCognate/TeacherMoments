import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default () => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const stages = cloneDeep(run.data.stages);
  const currentStage = find(stages, { slideRef: activeSlideRef });


  if (!currentStage.isSubmitted) {
    currentStage.isSubmitted = true;
    return run.set({ stages });
  }

}