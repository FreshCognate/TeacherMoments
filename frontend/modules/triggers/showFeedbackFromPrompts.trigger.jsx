import getBlockTracking from "../run/helpers/getBlockTracking";
import setSlideFeedback from "../run/helpers/setSlideFeedback";
import registerTrigger from "./helpers/registerTrigger";
import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";
import xor from 'lodash/xor';
import map from 'lodash/map';
import filter from 'lodash/filter';
import getString from "../ls/helpers/getString";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Feedback text',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

const ShowFeedbackFromPrompts = {
  trigger: async (trigger) => {
    return new Promise((resolve, reject) => {

      let matchedItems = [];
      for (const triggerItem of trigger.items) {
        let hasMatched = false;
        for (const condition of triggerItem.conditions) {
          const promptsMatched = [];
          for (const prompt of condition.prompts) {
            const blockTracking = getBlockTracking({ blockRef: prompt.ref });
            console.log(blockTracking);
            console.log(prompt, trigger);
            const selectedOptions = blockTracking.selectedOptions;
            const test = xor(prompt.options, selectedOptions);

            if (test.length === 0) {
              promptsMatched.push(prompt);
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