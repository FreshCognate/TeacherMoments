import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import getScenarioDetails from "./getScenarioDetails";

export default function getCurrentStage() {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  if (!activeSlideRef) {
    return null;
  }

  const stages = run.data?.stages || [];

  return find(stages, { slideRef: activeSlideRef }) || null;
}
