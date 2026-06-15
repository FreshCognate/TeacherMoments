import getCache from "~/core/cache/helpers/getCache";
import filter from 'lodash/filter';
import each from 'lodash/each';

export default function createStageForSlide(slideRef) {
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

  return {
    slideRef,
    blocksByRef,
    isComplete: false,
    startedAt: new Date()
  };
}
