import getPromptBlocksBySlideRef from "~/modules/blocks/helpers/getPromptBlocksBySlideRef";
import { Slide } from "../slides.types";
export default ({ slide }: { slide: Slide }) => {
  const slidePrompts = getPromptBlocksBySlideRef({ slideRef: slide.ref });
  if (slidePrompts.length > 0) return true;
  return false;
}