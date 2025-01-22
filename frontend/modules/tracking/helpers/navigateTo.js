import getCache from "~/core/cache/helpers/getCache";
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import each from 'lodash/each';

export default async ({ slideRef }) => {

  const tracking = getCache('tracking');

  const stages = cloneDeep(tracking.data.stages || []);

  const slideBlocks = filter(getCache('blocks').data, { slideRef });

  let blocksByRef = {};

  each(slideBlocks, (block) => {
    let defaultTracking = {};

    switch (block.blockType) {
      case 'ANSWERS_PROMPT':
        defaultTracking = {
          answerValues: [],
          isComplete: false
        }
    }

    blocksByRef[block.ref] = defaultTracking;
  })

  stages.push({ slideRef: slideRef, blocksByRef })

  tracking.set({ activeSlideRef: slideRef, stages });

}