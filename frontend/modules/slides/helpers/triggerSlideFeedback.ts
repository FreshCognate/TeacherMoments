import getBlocksBySlideRef from "~/modules/blocks/helpers/getBlocksBySlideRef";
import { FeedbackItem, Slide } from "../slides.types";
import { StageFeedbackItem } from "~/modules/run/runs.types";
import getSlideFeedbackErrors from "./getSlideFeedbackErrors";
import setSlideStatus from "~/modules/run/helpers/setSlideStatus";
import getBlockDisplayType from "~/modules/blocks/helpers/getBlockDisplayType";
import getString from "~/modules/ls/helpers/getString";
import getBlockTracking from "~/modules/run/helpers/getBlockTracking";
import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';
import xor from 'lodash/xor';
import generate from "~/modules/generate/helpers/generate";
import setSlideTrigger from "~/modules/run/helpers/setSlideTrigger";
import setSlideFeedback from "~/modules/run/helpers/setSlideFeedback";
import setSlideFeedbackItems from "~/modules/run/helpers/setSlideFeedbackItems";

type PromptItemCondition = {
  feedbackItemId: string,
  conditionId: string,
  text?: string,
  options?: string[],
  score: number,
  reasoning?: string
};

type PromptItem = {
  blockRef: string,
  blockType: string,
  stem?: string,
  selectedOptions: string[],
  textValue: string,
  conditions: PromptItemCondition[]
};

export default async ({ slide }: { slide: Slide }) => {

  const errors = getSlideFeedbackErrors(slide);

  if (errors.length) {
    return console.warn(`Skipping invalid slide feedback: ${slide.name || slide.sortOrder}`, errors);
  }

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });

  // Gather block and block tracking info

  setSlideStatus('Analyzing prompts');

  let items: PromptItem[] = [];

  for (const block of blocks) {
    if (getBlockDisplayType(block) === 'PROMPT') {

      let item: PromptItem = {
        blockRef: block.ref,
        blockType: block.blockType,
        stem: getString({ model: block, field: 'body' }),
        selectedOptions: [],
        textValue: "",
        conditions: []
      };

      const blockTracking = getBlockTracking({ blockRef: block.ref });

      if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {
        item.selectedOptions = blockTracking.selectedOptions;
      }

      if (block.blockType === 'INPUT_PROMPT') {
        item.textValue = blockTracking.textValue;
      }

      items.push(item);

    }
  }

  // Gather condition info

  for (const feedbackItem of slide.feedbackItems) {

    const feedbackItemId = feedbackItem._id;
    // feedbackItem has feedback and conditions
    for (const condition of feedbackItem.conditions) {

      const conditionId = condition._id;
      for (const prompt of condition.prompts) {

        const item = find(items, { blockRef: prompt.ref })!;

        item.conditions.push({
          feedbackItemId,
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
        const currentCondition = find(item.conditions, { conditionId: generatedCondition._id })!;
        currentCondition.score = generatedCondition.score;
        currentCondition.reasoning = generatedCondition.reasoning;
      }

    }
  }

  setSlideStatus('Generating feedback');
  // Now match individual trigger items

  let matchedItems: FeedbackItem[] = [];
  for (const feedbackItem of slide.feedbackItems) {
    let hasMatched = false;
    for (const condition of feedbackItem.conditions) {
      const promptsMatched = [];
      for (const prompt of condition.prompts) {

        const item = find(items, { blockRef: prompt.ref })!;

        const itemCondition = find(item.conditions, { conditionId: condition._id })!;

        if (itemCondition.score >= 0.7) {
          promptsMatched.push(prompt);
        }

      }
      if (condition.prompts.length === promptsMatched.length) {
        hasMatched = true;
      }
    }
    if (hasMatched) {
      matchedItems.push(feedbackItem);
    }
  }

  if (matchedItems.length === 0) {
    const unmatchedItems = filter(slide.feedbackItems, (item) => item.conditions.length === 0);
    matchedItems.push(...unmatchedItems);
  }

  const matchedItemsFeedback = map(matchedItems, (matchedItem) => {
    return getString({ model: matchedItem, field: 'body' });
  })

  const feedbackItems: StageFeedbackItem[] = map(items, (item) => {
    return {
      blockRef: item.blockRef,
      blockType: item.blockType,
      conditions: map(item.conditions, (condition) => {
        return {
          conditionId: condition.conditionId,
          feedbackItemId: condition.feedbackItemId,
          score: condition.score,
          reasoning: condition.reasoning
        };
      })
    }
  })
  setSlideFeedbackItems(feedbackItems);
  let feedback: (string | undefined)[] = [];
  if (slide.shouldGenerateFeedbackFromAI) {
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
  setSlideStatus(null);
}