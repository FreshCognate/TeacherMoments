import setSlideFeedback from "../run/helpers/setSlideFeedback";
import registerTrigger from "./helpers/registerTrigger";
import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Feedback text',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

const ShowFeedbackFromPrompts = {
  trigger: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setSlideFeedback(["This is some fake feedback"]);
        resolve();
      }, 1000);
    })
  },
  getShouldStopNavigation: () => {
    return true;
  },
  getAction: () => {
    return 'SHOW_FEEDBACK_FROM_PROMPTS';
  },
  getText: () => {
    return 'Show feedback from prompts';
  },
  getDescription: (trigger) => {
    return `Show feedback based upon the selected prompts in this slide.`
  },
  getSchema: (trigger) => {
    return {
      items: {
        type: 'Array',
        label: 'Feedback items',
        deleteTitleText: "Delete feedback item",
        addButtonText: "Add feedback item",
        shouldStopLastItemDelete: true,
        subSchema: {
          ...body,
          conditions: {
            type: 'FeedbackItemConditions',
            label: 'Select this item if'
          }
        }
      }
    }
  }
}

registerTrigger('SHOW_FEEDBACK_FROM_PROMPTS', ShowFeedbackFromPrompts);