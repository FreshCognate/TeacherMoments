import getBlocksBySlideRef from "~/modules/blocks/helpers/getBlocksBySlideRef";
import getSlideTracking from "./getSlideTracking"
import getBlockTracking from "./getBlockTracking";

export default () => {
  let isAbleToCompleteSlide = true;
  let hasRequiredPrompts = false;
  const slideTracking = getSlideTracking();
  if (slideTracking) {

    const blocks = getBlocksBySlideRef({ slideRef: slideTracking.slideRef });

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