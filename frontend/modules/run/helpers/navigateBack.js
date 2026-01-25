import getCache from "~/core/cache/helpers/getCache";
import findIndex from 'lodash/findIndex';
import getScenarioDetails from "./getScenarioDetails";

export default async () => {

  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  const { stages } = run.data;

  const currentStageIndex = findIndex(stages, { slideRef: activeSlideRef });

  if (currentStageIndex === 0) return;

  if (stages[currentStageIndex - 1]) {
    run.set({ activeSlideRef: stages[currentStageIndex - 1].slideRef });
  }

}