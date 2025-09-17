import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import each from 'lodash/each';
import getIsSlideComplete from "./getIsSlideComplete";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";
import findSlideStage from "./findSlideStage";
import { createSearchParams } from "react-router";

export default async ({ slideRef, router }) => {

  const run = getCache('run');

  const stages = cloneDeep(run.data.stages || []);

  const slideStage = findSlideStage({ slideRef });

  if (!slideStage) {

    const slideBlocks = filter(getCache('blocks').data, { slideRef });

    let blocksByRef = {};

    each(slideBlocks, (block) => {
      let defaultBlockTracking = {};

      switch (block.blockType) {
        case 'MULTIPLE_CHOICE_PROMPT':
          defaultBlockTracking = {
            selectedOptions: [],
            isComplete: false
          }
          break;
        case 'INPUT_PROMPT':
          defaultBlockTracking = {
            textValue: "",
            isComplete: false
          }
          break;
      }

      blocksByRef[block.ref] = defaultBlockTracking;
    });

    let isSlideComplete = getIsSlideComplete({ blocksByRef });

    stages.push({ slideRef: slideRef, blocksByRef, isComplete: isSlideComplete })

  }

  if (isScenarioInPlay()) {
    run.mutate({ activeSlideRef: slideRef, stages }, { method: 'put' });
  } else {
    run.set({ activeSlideRef: slideRef, stages });
  }

  router.navigate({
    pathname: router.pathname,
    search: `?${createSearchParams({ slide: slideRef })}`,
  })

}