import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import each from 'lodash/each';
import getIsSlideComplete from "./getIsSlideComplete";
import isScenarioInPlay from "~/modules/scenarios/helpers/isScenarioInPlay";
import findSlideTracking from "./findSlideTracking";

export default async ({ slideRef }) => {

  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages || []);

  const slideTracking = findSlideTracking({ slideRef });

  if (!slideTracking) {

    const slideBlocks = filter(getCache('blocks').data, { slideRef });

    let blocksByRef = {};

    each(slideBlocks, (block) => {
      let defaultTracking = {};

      switch (block.blockType) {
        case 'MULTIPLE_CHOICE_PROMPT':
          defaultTracking = {
            selectedOptions: [],
            isComplete: false
          }
          break;
        case 'INPUT_PROMPT':
          defaultTracking = {
            textValue: "",
            isComplete: false
          }
          break;
      }

      blocksByRef[block.ref] = defaultTracking;
    });

    let isSlideComplete = getIsSlideComplete({ blocksByRef });

    stages.push({ slideRef: slideRef, blocksByRef, isComplete: isSlideComplete })

  }

  if (isScenarioInPlay()) {
    tracking.mutate({ activeSlideRef: slideRef, stages }, { method: 'put' });
  } else {
    tracking.set({ activeSlideRef: slideRef, stages });
  }

}