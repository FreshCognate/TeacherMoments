import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default ({ blockRef }) => {
 
  const run = getCache('run');

  const { activeSlideRef } = getScenarioDetails();

  const currentStage = find(run.data.stages, { slideRef: activeSlideRef })
  const blocksByRef = currentStage.blocksByRef || {};
  return blocksByRef[blockRef] || {};

}