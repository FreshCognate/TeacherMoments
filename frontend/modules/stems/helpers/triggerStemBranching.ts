import getBlocksBySlideRef from "~/modules/blocks/helpers/getBlocksBySlideRef";
import { Stem } from "../stems.types";
import { Slide } from "~/modules/slides/slides.types";
import setSlideStatus from "~/modules/run/helpers/setSlideStatus";
import getBlockDisplayType from "~/modules/blocks/helpers/getBlockDisplayType";
import getString from "~/modules/ls/helpers/getString";
import getBlockTracking from "~/modules/run/helpers/getBlockTracking";
import find from 'lodash/find';
import xor from 'lodash/xor';
import generate from "~/modules/generate/helpers/generate";
import map from 'lodash/map'

export default async ({ stem, slide }: { stem: Stem, slide: Slide }) => {
  // const errors = getStemBranchingErrors(slide);

  // if (errors.length) {
  //   return console.warn(`Skipping invalid stem branching: ${stem.name || stem.sortOrder}`, errors);
  // }

  const blocks = getBlocksBySlideRef({ slideRef: slide.ref });

  // Gather block and block tracking info

  setSlideStatus('Analyzing prompts');

  return;

  // let items = [];

  // for (const block of blocks) {
  //   if (getBlockDisplayType(block) === 'PROMPT') {

  //     let item = {};

  //     item.blockRef = block.ref;
  //     item.blockType = block.blockType;
  //     item.stem = getString({ model: block, field: 'body' });
  //     item.selectedOptions = [];
  //     item.textValue = "";

  //     const blockTracking = getBlockTracking({ blockRef: block.ref });

  //     if (block.blockType === 'MULTIPLE_CHOICE_PROMPT') {
  //       item.selectedOptions = blockTracking.selectedOptions;
  //     }

  //     if (block.blockType === 'INPUT_PROMPT') {
  //       item.textValue = blockTracking.textValue;
  //     }

  //     item.conditions = [];

  //     items.push(item);

  //   }
  // }

  // console.log("items", items);

  // // Gather condition info

  // for (const triggerItem of trigger.items) {

  //   const triggerItemId = triggerItem._id;
  //   // triggerItem has feedback and conditions
  //   for (const condition of triggerItem.conditions) {

  //     const conditionId = condition._id;
  //     for (const prompt of condition.prompts) {

  //       const item = find(items, { blockRef: prompt.ref });

  //       item.conditions.push({
  //         triggerItemId,
  //         conditionId,
  //         text: prompt.text,
  //         options: prompt.options,
  //         score: 0
  //       })
  //     }
  //   }
  // }

  // // Mark items based upon their conditions and score each condition.

  // for (const item of items) {
  //   if (item.blockType === 'MULTIPLE_CHOICE_PROMPT') {
  //     for (const condition of item.conditions) {

  //       const test = xor(item.selectedOptions, condition.options);

  //       if (test.length === 0) {
  //         condition.score = 1;
  //       }
  //     }
  //   }

  //   if (item.blockType === 'INPUT_PROMPT') {
  //     const stem = item.stem;
  //     const usersAnswer = item.textValue;
  //     const conditions = map(item.conditions, (condition) => {
  //       return { _id: condition.conditionId, condition: condition.text };
  //     });

  //     const generatedContent = await generate({
  //       generateType: 'USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT',
  //       payload: {
  //         stem,
  //         usersAnswer,
  //         conditions,
  //       }
  //     });

  //     const generatedConditions = generatedContent.payload.conditions;

  //     for (const generatedCondition of generatedConditions) {
  //       const currentCondition = find(item.conditions, { conditionId: generatedCondition._id });
  //       currentCondition.score = generatedCondition.score;
  //       currentCondition.reasoning = generatedCondition.reasoning;
  //     }

  //   }
  // }

}