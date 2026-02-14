import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";
import { createStageForSlide } from "./getCurrentStage";
import { createSearchParams } from "react-router";
import getCohortFromSearchParams from "~/modules/cohorts/helpers/getCohortFromSearchParams";

export default async ({ slideRef, router }) => {

  const run = getCache('run');

  const stages = cloneDeep(run.data.stages || []);

  const slideStage = find(stages, { slideRef });

  if (!slideStage) {
    stages.push(createStageForSlide(slideRef));
  }

  if (isScenarioInPlay()) {
    run.mutate({ activeSlideRef: slideRef, stages }, { method: 'put' });
  } else {
    run.set({ activeSlideRef: slideRef, stages });
  }

  const cohort = getCohortFromSearchParams(router);

  const newSearchParams = { slide: slideRef };
  if (cohort) {
    newSearchParams.cohort = cohort;
  }

  router.navigate({
    pathname: router.pathname,
    search: `?${createSearchParams(newSearchParams)}`,
  }, { replace: true })

}