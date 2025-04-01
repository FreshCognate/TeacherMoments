import getBlocksBySlideRef from "~/modules/blocks/helpers/getBlocksBySlideRef";
import getSlideStage from "./getSlideStage"
import getBlockTracking from "./getBlockTracking";

export default () => {
  let isAbleToCompleteSlide = true;
  let hasRequiredPrompts = false;
  const slideStage = getSlideStage();
  if (slideStage) {

    const blocks = getBlocksBySlideRef({ slideRef: slideStage.slideRef });

    for (const block of blocks) {

      if (block.isRequired) {
        hasRequiredPrompts = true;
        const blockTracking = getBlockTracking({ blockRef: block.ref });

        if (!blockTracking.isAbleToComplete) {
          isAbleToCompleteSlide = false;
        }

      }
    }

  }
  return { isAbleToCompleteSlide, hasRequiredPrompts };
}