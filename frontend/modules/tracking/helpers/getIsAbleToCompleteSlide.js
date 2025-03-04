import getBlocksBySlideRef from "~/modules/blocks/helpers/getBlocksBySlideRef";
import getSlideTracking from "./getSlideTracking"
import getBlockTracking from "./getBlockTracking";

export default () => {
  let isAbleToCompleteSlide = true;
  const slideTracking = getSlideTracking();
  if (slideTracking) {

    const blocks = getBlocksBySlideRef({ slideRef: slideTracking.slideRef });

    for (const block of blocks) {

      if (block.isRequired) {

        const blockTracking = getBlockTracking({ blockRef: block.ref });

        if (!blockTracking.isAbleToComplete) {
          isAbleToCompleteSlide = false;
        }

      }
    }

  }
  return isAbleToCompleteSlide;
}