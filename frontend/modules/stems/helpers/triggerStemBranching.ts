import getBlocksBySlideRef from "~/modules/blocks/helpers/getBlocksBySlideRef";
import { BranchingOption, Stem, StemBranchingItem } from "../stems.types";
import { Slide } from "~/modules/slides/slides.types";
import setSlideStatus from "~/modules/run/helpers/setSlideStatus";
import getBlockDisplayType from "~/modules/blocks/helpers/getBlockDisplayType";
import getString from "~/modules/ls/helpers/getString";
import getBlockTracking from "~/modules/run/helpers/getBlockTracking";
import find from 'lodash/find';
import xor from 'lodash/xor';
import generate from "~/modules/generate/helpers/generate";
import map from 'lodash/map'
import orderBy from 'lodash/orderBy'
import getCache from "~/core/cache/helpers/getCache";
import setSlideNavigation from "~/modules/run/helpers/setSlideNavigation";
import navigateTo from "~/modules/run/helpers/navigateTo";
import getStemByRef from "./getStemByRef";
import getConditionlessStems from "~/modules/triggers/helpers/getConditionlessStems";


export default async ({ stem, slide, router }: { stem: Stem, slide: Slide, router: any }) => {
  // const errors = getStemBranchingErrors(slide);

  // if (errors.length) {
  //   return console.warn(`Skipping invalid stem branching: ${stem.name || stem.sortOrder}`, errors);
  // }

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });

  // Gather block and block tracking info

  setSlideStatus('Analyzing prompts');

  let items: StemBranchingItem[] = [];

  for (const block of blocks) {
    if (getBlockDisplayType(block) === 'PROMPT') {

      const item: StemBranchingItem = {
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

  for (const branchingOption of stem.branchingOptions) {

    const branchingOptionId = branchingOption._id;
    // branchingOption has feedback and conditions
    for (const condition of branchingOption.conditions) {

      const conditionId = condition._id;
      for (const prompt of condition.prompts) {

        const item = find(items, { blockRef: prompt.ref })!;

        item.conditions.push({
          branchingOptionId,
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

  setSlideStatus('Navigating...');
  // Now match individual branching options

  let matchedItems: BranchingOption[] = [];
  for (const branchingOption of stem.branchingOptions) {
    let hasMatched = false;
    for (const condition of branchingOption.conditions) {
      const promptsMatched = [];
      for (const prompt of condition.prompts) {

        const item = find(items, { blockRef: prompt.ref })!;

        const itemCondition = find(item.conditions, { conditionId: condition._id })!;

        branchingOption.score = itemCondition.score;

        if (itemCondition.score >= 0.7) {
          promptsMatched.push(prompt);
        }

      }
      if (condition.prompts.length === promptsMatched.length) {
        hasMatched = true;
      }
    }
    if (hasMatched) {
      matchedItems.push(branchingOption);
    }
  }

  const branchingOptions = map(items, (item) => {
    return {
      blockRef: item.blockRef,
      blockType: item.blockType,
      conditions: map(item.conditions, (condition) => {
        return {
          conditionId: condition.conditionId,
          branchingOptionId: condition.branchingOptionId,
          score: condition.score,
          reasoning: condition.reasoning
        };
      })
    }
  });

  console.log(branchingOptions, matchedItems);

  // TODO - we need to do something here
  //setSlideTrigger({ triggerRef: trigger.ref, triggerItems });

  const matchedItem = orderBy(matchedItems, 'score', 'desc')[0];

  setSlideStatus(null);

  // A stem left without conditions catches everything, and wins over the
  // default. The default only applies once every stem has conditions.
  const conditionlessStem = getConditionlessStems({ stem })[0];

  let targetStem: Stem | null = null;

  if (matchedItem) {
    targetStem = getStemByRef({ ref: matchedItem.elementRef });
  } else if (conditionlessStem) {
    targetStem = conditionlessStem;
  } else if (stem.defaultBranchingStemRef) {
    targetStem = getStemByRef({ ref: stem.defaultBranchingStemRef });
  }

  if (!targetStem) return;

  const slides = getCache('slides').data;
  const firstSlideOfStem = find(slides, { stemRef: targetStem.ref });

  if (!firstSlideOfStem) return;

  setSlideNavigation({ slideRef: firstSlideOfStem.ref, stemRef: targetStem.ref });
  navigateTo({ slideRef: firstSlideOfStem.ref, router });

}