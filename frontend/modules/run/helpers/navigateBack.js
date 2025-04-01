import getCache from "~/core/cache/helpers/getCache";
import findIndex from 'lodash/findIndex';

export default async () => {

  const run = getCache('run');

  const { activeSlideRef, stages } = run.data;

  const currentStageIndex = findIndex(stages, { slideRef: activeSlideRef });

  if (currentStageIndex === 0) return;

  if (stages[currentStageIndex - 1]) {
    run.set({ activeSlideRef: stages[currentStageIndex - 1].slideRef });
  }

}