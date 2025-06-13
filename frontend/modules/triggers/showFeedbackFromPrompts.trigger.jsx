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
        resolve();
      }, 4000);
    })
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
      blocks: {
        type: 'TriggerBlocksSelector',
        label: 'Selected blocks:',
        blockTypes: ['INPUT_PROMPT', 'MULTIPLE_CHOICE_PROMPT']
      },
      items: {
        type: 'Array',
        label: 'Feedback items',
        deleteTitleText: "Delete feedback item",
        addButtonText: "Add feedback item",
        shouldStopLastItemDelete: true,
        subSchema: {
          ...body
        }
      }
    }
  }
}

registerTrigger('SHOW_FEEDBACK_FROM_PROMPTS', ShowFeedbackFromPrompts);