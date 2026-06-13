import getScenarioDetails from "../run/helpers/getScenarioDetails";
import getStemsBySlideRef from "../stems/helpers/getStemsBySlideRef";
import registerTrigger from "./helpers/registerTrigger";
import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Feedback message',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

const BranchToStemFromPrompts = {
  trigger: async (trigger) => {
    return new Promise(async (resolve, reject) => {

      console.log('triggering...');

    })
  },
  isAvailable: () => {
    const { activeSlideRef } = getScenarioDetails();
    const slideStems = getStemsBySlideRef({ slideRef: activeSlideRef });
    if (slideStems.length > 0) {
      return true;
    }
    return false;
  },
  getShouldStopNavigation: () => {
    return true;
  },
  getAction: () => {
    return 'BRANCH_TO_STEM_FROM_PROMPTS';
  },
  getText: () => {
    return 'Branch to a stem based on prompt responses';
  },
  getDescription: (trigger) => {
    return `Evaluates user responses from input and multiple choice prompts and branches the user to a specific stem when transitioning to the next slide.`
  },
  getSchema: (trigger) => {
    return {

    }
  }
}

registerTrigger('BRANCH_TO_STEM_FROM_PROMPTS', BranchToStemFromPrompts);