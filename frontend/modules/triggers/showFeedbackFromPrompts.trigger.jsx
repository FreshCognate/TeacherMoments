import getBlockTracking from "../run/helpers/getBlockTracking";
import setSlideFeedback from "../run/helpers/setSlideFeedback";
import registerTrigger from "./helpers/registerTrigger";
import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";
import xor from 'lodash/xor';
import map from 'lodash/map';
import filter from 'lodash/filter';
import getString from "../ls/helpers/getString";
import getBlockByRef from "../blocks/helpers/getBlockByRef";
import generate from "../generate/helpers/generate";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Feedback text',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

const ShowFeedbackFromPrompts = {
  trigger: async (trigger) => {
    return new Promise(async (resolve, reject) => {

      let matchedItems = [];
      for (const triggerItem of trigger.items) {
        let hasMatched = false;
        for (const condition of triggerItem.conditions) {
          const promptsMatched = [];
          for (const prompt of condition.prompts) {
            const blockTracking = getBlockTracking({ blockRef: prompt.ref });
            const block = getBlockByRef({ ref: prompt.ref });

            if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {

              const selectedOptions = blockTracking.selectedOptions;
              const test = xor(prompt.options, selectedOptions);

              if (test.length === 0) {
                promptsMatched.push(prompt);
              }

            }
            if (block.blockType === 'INPUT_PROMPT') {
              const userText = blockTracking.textValue;
              const promptText = prompt.text;
              const generatedContent = await generate({
                generateType: 'USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT',
                userText,
                promptText
              });
              console.log(generatedContent);
            }

          }
          if (condition.prompts.length === promptsMatched.length) {
            hasMatched = true;
          }
        }
        if (hasMatched) {
          matchedItems.push(triggerItem);
        }
      }

      if (matchedItems.length === 0) {
        const unmatchedItems = filter(trigger.items, (item) => {
          if (item.conditions.length === 0) {
            return item;
          }
        });
        matchedItems.push(...unmatchedItems);
        console.log('should find unmatched items');
      }

      const matchedItemsFeedback = map(matchedItems, (matchedItem) => {
        return getString({ model: matchedItem, field: 'body' });
      })
      setSlideFeedback(matchedItemsFeedback);
      resolve();

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