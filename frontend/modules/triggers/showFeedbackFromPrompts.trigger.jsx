import getBlockTracking from "../run/helpers/getBlockTracking";
import setSlideFeedback from "../run/helpers/setSlideFeedback";
import registerTrigger from "./helpers/registerTrigger";
import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";
import xor from 'lodash/xor';
import map from 'lodash/map';
import filter from 'lodash/filter';
import find from 'lodash/find';
import getString from "../ls/helpers/getString";
import getBlocksBySlideRef from "../blocks/helpers/getBlocksBySlideRef";
import getBlockDisplayType from "../blocks/helpers/getBlockDisplayType";
import generate from "../generate/helpers/generate";
import setSlideTrigger from "../run/helpers/setSlideTrigger";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Feedback text',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

const ShowFeedbackFromPrompts = {
  trigger: async (trigger) => {
    return new Promise(async (resolve, reject) => {

      const blocks = getBlocksBySlideRef({ slideRef: trigger.elementRef });

      // Gather block and block tracking info

      let items = [];

      for (const block of blocks) {
        if (getBlockDisplayType(block) === 'PROMPT') {

          let item = {};

          item.blockRef = block.ref;
          item.blockType = block.blockType;
          item.stem = getString({ model: block, field: 'body' });
          item.selectedOptions = [];
          item.textValue = "";

          const blockTracking = getBlockTracking({ blockRef: block.ref });

          if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {
            item.selectedOptions = blockTracking.selectedOptions;
          }

          if (block.blockType === 'INPUT_PROMPT') {
            item.textValue = blockTracking.textValue;
          }

          item.conditions = [];

          items.push(item);

        }
      }

      // Gather condition info

      for (const triggerItem of trigger.items) {

        const triggerItemId = triggerItem._id;
        // triggerItem has feedback and conditions
        for (const condition of triggerItem.conditions) {

          const conditionId = condition._id;
          for (const prompt of condition.prompts) {

            const item = find(items, { blockRef: prompt.ref });

            item.conditions.push({
              triggerItemId,
              conditionId,
              text: prompt.text,
              options: prompt.options,
              score: 0
            })
          }
        }
      }

      // Mark items based upon their conditions and score each condition.

      for (const item of items) {

        if (item.blockType === 'MULTIPLE_CHOICE_PROMPT') {
          for (const condition of item.conditions) {

            const test = xor(item.selectedOptions, condition.options);

            if (test.length === 0) {
              condition.score = 1;
            }
          }
        }

        if (item.blockType === 'INPUT_PROMPT') {
          const stem = item.stem;
          const usersAnswer = item.textValue;
          const conditions = map(item.conditions, (condition) => {
            return { _id: condition.conditionId, condition: condition.text };
          });

          const generatedContent = await generate({
            generateType: 'USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT',
            payload: {
              stem,
              usersAnswer,
              conditions,
            }
          });

          const generatedConditions = generatedContent.payload.conditions;

          for (const generatedCondition of generatedConditions) {
            const currentCondition = find(item.conditions, { conditionId: generatedCondition._id });
            currentCondition.score = generatedCondition.score;
            currentCondition.reasoning = generatedCondition.reasoning;
          }

        }
      }

      // Now match individual trigger items

      let matchedItems = [];
      for (const triggerItem of trigger.items) {
        let hasMatched = false;
        for (const condition of triggerItem.conditions) {
          const promptsMatched = [];
          for (const prompt of condition.prompts) {

            const item = find(items, { blockRef: prompt.ref });

            const itemCondition = find(item.conditions, { conditionId: condition._id });
            console.log(itemCondition.score);

            if (itemCondition.score >= 0.7) {
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
      }

      const matchedItemsFeedback = map(matchedItems, (matchedItem) => {
        return getString({ model: matchedItem, field: 'body' });
      })

      const triggerItems = map(items, (item) => {
        return {
          blockRef: item.blockRef,
          blockType: item.blockType,
          conditions: map(item.conditions, (condition) => {
            return {
              conditionId: condition.conditionId,
              triggerItemId: condition.triggerItemId,
              score: condition.score,
              reasoning: condition.reasoning
            };
          })
        }
      })

      setSlideTrigger({ triggerRef: trigger.ref, triggerItems });
      let feedback = [];
      if (trigger.shouldGenerateFeedbackFromAI) {
        const generatedContent = await generate({
          generateType: 'FEEDBACK_FROM_FEEDBACK_ITEMS',
          payload: {
            feedbackItems: matchedItemsFeedback,
            items
          }
        });

        feedback = [generatedContent.payload.feedback];
      } else {
        feedback = matchedItemsFeedback;
      }

      setSlideFeedback(feedback);
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
      },
      shouldGenerateFeedbackFromAI: {
        type: 'Toggle',
        label: 'Generate feedback from AI',
        options: [{
          value: true,
          icon: 'confirm'
        }, {
          value: false,
          icon: 'cancel'
        }]
      }
    }
  }
}

registerTrigger('SHOW_FEEDBACK_FROM_PROMPTS', ShowFeedbackFromPrompts);