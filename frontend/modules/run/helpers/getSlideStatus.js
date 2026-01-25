import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default (status) => {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const currentStage = find(run.data.stages, { slideRef: activeSlideRef });

  if (currentStage) {
    return currentStage.status;
  }

}