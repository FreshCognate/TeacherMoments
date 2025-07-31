import getBlockTracking from "../run/helpers/getBlockTracking";
import setSlideFeedback from "../run/helpers/setSlideFeedback";
import registerTrigger from "./helpers/registerTrigger";
import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";
import xor from 'lodash/xor';
import map from 'lodash/map';
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
        let hasMatched = true;
        for (const condition of triggerItem.conditions) {
          const blockRefs = Object.keys(condition.blocksByRef);
          for (const blockRef of blockRefs) {
            const blockTracking = getBlockTracking({ blockRef: blockRef });
            const selectedOptions = blockTracking.selectedOptions;
            const test = xor(condition.blocksByRef[blockRef], selectedOptions);

            if (test.length > 0) {
              hasMatched = false;
            }

          }
        }
        if (hasMatched) {
          matchedItems.push(triggerItem);
        }
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