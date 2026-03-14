import createAgent from '../agents/helpers/createAgent.js';
import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import getScenarioSlidesAndBlocksByRef from '../../backend/modules/responses/helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../../backend/modules/responses/helpers/buildUserScenarioResponse.js';
import find from 'lodash/find.js';
import each from 'lodash/each.js';
import filter from 'lodash/filter.js';
import sortBy from 'lodash/sortBy.js';
import values from 'lodash/values.js';
import uniqBy from 'lodash/uniqBy.js';
import map from 'lodash/map.js';
import getBlockText from '../helpers/getBlockText.js';

const PROMPT_BLOCK_TYPES = ['INPUT_PROMPT', 'MULTIPLE_CHOICE_PROMPT'];

export default async ({ cohortId, scenarioId, slideRef }) => {

  const { models } = await connectDatabase();
  const context = { models };

  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  const slide = slidesByRef[slideRef];

  if (!slide) {
    throw new Error('Slide not found');
  }

  const slideBlocks = sortBy(
    filter(values(blocksByRef), (block) => String(block.slideRef) === String(slideRef)),
    'sortOrder'
  );

  const promptBlocks = filter(slideBlocks, (block) => PROMPT_BLOCK_TYPES.includes(block.blockType));

  if (promptBlocks.length === 0) {
    throw new Error('No prompt blocks found on this slide');
  }

  let userIds;

  if (cohortId) {
    const users = await models.User.find({ 'cohorts.cohort': cohortId }).lean();
    userIds = map(users, '_id');
  } else {
    const runs = await models.Run.find({ scenario: scenarioId, isDeleted: false }).lean();
    userIds = map(uniqBy(runs, 'user'), 'user');
  }

  const blockResponsesMap = {};
  each(promptBlocks, (block) => {
    blockResponsesMap[String(block.ref)] = [];
  });

  for (const userId of userIds) {
    const { blockResponses, stages } = await buildUserScenarioResponse({ userId, scenarioId, slidesByRef, blocksByRef }, context);
    const stage = find(stages, (s) => String(s.slideRef) === String(slideRef));
    const feedbackItems = stage?.feedbackItems || [];

    each(promptBlocks, (block) => {
      const blockRef = String(block.ref);
      const blockResponse = find(blockResponses, (br) => String(br.ref) === blockRef);

      if (blockResponse) {
        let responseText = '';

        if (blockResponse.textValue) {
          responseText = blockResponse.textValue;
        } else if (blockResponse.selectedOptions && blockResponse.selectedOptions.length) {
          responseText = blockResponse.selectedOptions.join(', ');
        }

        if (responseText) {
          blockResponsesMap[blockRef].push({
            response: responseText,
            feedback: feedbackItems.length ? feedbackItems.join(', ') : null
          });
        }
      }
    });
  }

  let totalResponses = 0;
  each(blockResponsesMap, (responses) => {
    totalResponses += responses.length;
  });

  if (totalResponses < 2) {
    throw new Error('Not enough responses to generate a summary');
  }

  let slideContext = '';

  if (slide.name) {
    slideContext += `Slide title: ${slide.name}\n`;
  }

  slideContext += '\nThe slide contains the following content:\n';

  each(slideBlocks, (block) => {
    const blockBody = getBlockText(block, 'body');
    const blockTypeLabel = block.blockType === 'INPUT_PROMPT' ? 'Text input prompt'
      : block.blockType === 'MULTIPLE_CHOICE_PROMPT' ? 'Multiple choice prompt'
        : 'Content';

    slideContext += `- [${blockTypeLabel}] ${blockBody}\n`;
  });

  let promptContent = '';

  each(promptBlocks, (block) => {
    const blockRef = String(block.ref);
    const responses = blockResponsesMap[blockRef];

    if (responses.length === 0) return;

    const blockBody = getBlockText(block, 'body');
    const blockTypeLabel = block.blockType === 'INPUT_PROMPT' ? 'Text input' : 'Multiple choice';

    promptContent += `
      ## ${blockBody}
      Block type: ${blockTypeLabel}
    `;

    each(responses, (item, index) => {
      promptContent += `
        ### Response ${index + 1}
        #### User's response
        ${item.response}
      `;

      if (item.feedback) {
        promptContent += `
        #### AI feedback given
        ${item.feedback}
        `;
      }
    });
  });

  const agent = createAgent({ quality: 'medium' });

  agent.addSystemMessage(`
    You are an educational analytics assistant helping facilitators understand participant responses.
    You will be given the context of a slide, the prompts that were asked to participants, their responses, and any AI feedback that was given to them.

    ## Slide context
    ${slideContext}

    Provide a structured summary that highlights:
    - Common themes across responses
    - Notable differences or unique perspectives
    - Overall quality and depth of responses
    - If AI feedback was provided, note any patterns in the feedback given
    - Do not reference specific responses like Response 1 or Response 2 as they are not ordered and this will confuse the user, instead give an overview

    The JSON structured returned should be:
    {
      "overview": "A full overview of patterns, themes, and quality across the responses.",
      "sections": [
        {
          "title": "Optional title for this group",
          "content": "Detail about this group of responses, e.g. '3 participants demonstrated strong understanding of X' or 'Several participants received feedback about Y'."
        }
      ],
      "summary": "Actionable takeaways and recommendations for the facilitator."
    }

    Guidelines for each field:
    - "overview": A high-level narrative of what you observed across all responses.
    - "sections": Group related findings together. Each section should quantify where possible (e.g. "3 participants said..." or "Most participants received feedback about..."). The "title" field is optional and can be left as an empty string. The "content" field is required.
    - "summary": Concise, actionable recommendations the facilitator can act on.
  `);

  agent.addUserMessage(`
    ## Slide prompts and responses
    Below are the prompts on this slide, each followed by the participant responses collected.
    ${promptContent}
  `);

  const response = await agent.run();

  return {
    ...response,
    slide,
    blocks: slideBlocks
  };

};
