import getCache from "~/core/cache/helpers/getCache";
import findIndex from 'lodash/findIndex';

export default async () => {

  const tracking = getCache('tracking');

  const { activeSlideRef, stages } = tracking.data;

  const currentStageIndex = findIndex(stages, { slideRef: activeSlideRef });

  console.log(currentStageIndex);
  if (currentStageIndex === 0) return;

  if (stages[currentStageIndex - 1]) {
    tracking.set({ activeSlideRef: stages[currentStageIndex - 1].slideRef });
  }

}