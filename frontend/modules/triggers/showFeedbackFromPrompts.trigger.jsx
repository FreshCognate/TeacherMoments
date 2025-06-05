import registerTrigger from "./helpers/registerTrigger"

const ShowFeedbackFromPrompts = {
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

        }
      }
    }
  }
}

registerTrigger('SHOW_FEEDBACK_FROM_PROMPTS', ShowFeedbackFromPrompts);