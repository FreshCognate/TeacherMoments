import getBlockDisplayType from "../blocks/helpers/getBlockDisplayType";
import getBlocksBySlideRef from "../blocks/helpers/getBlocksBySlideRef";
import getString from "../ls/helpers/getString";
import getBlockTracking from "../run/helpers/getBlockTracking";
import getScenarioDetails from "../run/helpers/getScenarioDetails";
import setSlideStatus from "../run/helpers/setSlideStatus";
import setSlideTrigger from "../run/helpers/setSlideTrigger";
import getStemsByRef from "../stems/helpers/getStemsByRef";
import getStemsBySlideRef from "../stems/helpers/getStemsBySlideRef";
import registerTrigger from "./helpers/registerTrigger";
import find from 'lodash/find';
import xor from 'lodash/xor';
import map from 'lodash/map';
import getCache from "~/core/cache/helpers/getCache";
import navigateTo from "../run/helpers/navigateTo";
import setSlideNavigation from "../run/helpers/setSlideNavigation";
import generate from "../generate/helpers/generate";

const BranchToStemFromPrompts = {
  trigger: async (trigger, router) => {
    return new Promise(async (resolve, reject) => {

      const blocks = getBlocksBySlideRef({ slideRef: trigger.elementRef });

      // Gather block and block tracking info

      setSlideStatus('Analyzing prompts');

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

      setSlideStatus('Navigating...');
      // Now match individual trigger items

      let matchedItems = [];
      for (const triggerItem of trigger.items) {
        let hasMatched = false;
        for (const condition of triggerItem.conditions) {
          const promptsMatched = [];
          for (const prompt of condition.prompts) {

            const item = find(items, { blockRef: prompt.ref });

            const itemCondition = find(item.conditions, { conditionId: condition._id });

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

      // TODO - we should sort this based upon the score - then pick the first one
      const matchedItem = matchedItems[0];

      setSlideStatus(null);

      if (matchedItem) {
        const matchedStem = getStemsByRef({ ref: matchedItem.elementRef });
        const slides = getCache('slides').data;
        const getFirstSlideOfStem = find(slides, { stemRef: matchedStem.ref });
        resolve();
        setSlideNavigation({ slideRef: getFirstSlideOfStem.ref })
        navigateTo({ slideRef: getFirstSlideOfStem.ref, router });
      }

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
      items: {
        type: 'TriggerStems',
        label: 'Stems'
      }
    }
  }
}

registerTrigger('BRANCH_TO_STEM_FROM_PROMPTS', BranchToStemFromPrompts);