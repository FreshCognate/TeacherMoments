import getBlocksBySlideRef from "~/modules/blocks/helpers/getBlocksBySlideRef";
import getSlideStage from "./getSlideStage"
import getBlockTracking from "./getBlockTracking";
import getBlockDisplayType from "~/modules/blocks/helpers/getBlockDisplayType";

export default () => {
  let isAbleToCompleteSlide = true;
  let hasRequiredPrompts = false;
  let hasPrompts = false;
  let isSubmitted = false;
  const slideStage = getSlideStage();
  if (slideStage) {

    isSubmitted = slideStage.isSubmitted;

    const blocks = getBlocksBySlideRef({ slideRef: slideStage.slideRef });

    for (const block of blocks) {
      if (getBlockDisplayType(block) === 'PROMPT') {
        hasPrompts = true;
      }
      if (block.isRequired) {
        hasRequiredPrompts = true;
        const blockTracking = getBlockTracking({ blockRef: block.ref });

        if (!blockTracking.isAbleToComplete) {
          isAbleToCompleteSlide = false;
        }

      }
    }

  }
  return { isAbleToCompleteSlide, hasRequiredPrompts, hasPrompts, isSubmitted };
}