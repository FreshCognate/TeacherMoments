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
      }
    }
  }
}

registerTrigger('SHOW_FEEDBACK_FROM_PROMPTS', ShowFeedbackFromPrompts);