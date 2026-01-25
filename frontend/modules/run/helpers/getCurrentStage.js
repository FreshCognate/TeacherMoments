import getCache from "~/core/cache/helpers/getCache";
import find from 'lodash/find';
import filter from 'lodash/filter';
import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';
import getScenarioDetails from "./getScenarioDetails";
import getIsSlideComplete from "./getIsSlideComplete";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";

export default function getCurrentStage() {
  const run = getCache('run');
  const { activeSlideRef } = getScenarioDetails();

  if (!activeSlideRef) {
    return null;
  }

  const stages = run.data?.stages || [];
  let currentStage = find(stages, { slideRef: activeSlideRef });

  if (!currentStage) {
    currentStage = createStageForSlide(activeSlideRef);

    const newStages = cloneDeep(stages);
    newStages.push(currentStage);

    if (isScenarioInPlay()) {
      run.mutate({ stages: newStages }, { method: 'put' });
    } else {
      run.set({ stages: newStages });
    }
  }

  return currentStage;
}

export function createStageForSlide(slideRef) {
  const slideBlocks = filter(getCache('blocks').data, { slideRef });

  let blocksByRef = {};

  each(slideBlocks, (block) => {
    let defaultBlockTracking = {};

    switch (block.blockType) {
      case 'MULTIPLE_CHOICE_PROMPT':
        defaultBlockTracking = {
          selectedOptions: [],
          isComplete: false
        };
        break;
      case 'INPUT_PROMPT':
        defaultBlockTracking = {
          textValue: "",
          isComplete: false
        };
        break;
    }

    blocksByRef[block.ref] = defaultBlockTracking;
  });

  const isSlideComplete = getIsSlideComplete({ blocksByRef });

  return {
    slideRef,
    blocksByRef,
    isComplete: isSlideComplete
  };
}
