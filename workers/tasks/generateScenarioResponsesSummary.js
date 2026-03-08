import createAgent from '../agents/helpers/createAgent.js';
import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import getScenarioSlidesAndBlocksByRef from '../../backend/modules/responses/helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../../backend/modules/responses/helpers/buildUserScenarioResponse.js';
import getBlockText from '../helpers/getBlockText.js';
import find from 'lodash/find.js';
import each from 'lodash/each.js';
import filter from 'lodash/filter.js';
import sortBy from 'lodash/sortBy.js';
import values from 'lodash/values.js';

const PROMPT_BLOCK_TYPES = ['INPUT_PROMPT', 'MULTIPLE_CHOICE_PROMPT'];

export default async ({ cohortId, scenarioId }) => {

  const { models } = await connectDatabase();
  const context = { models };

  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  const promptBlocks = sortBy(
    filter(values(blocksByRef), (block) => PROMPT_BLOCK_TYPES.includes(block.blockType)),
    [(block) => {
      const slide = slidesByRef[block.slideRef];
      return slide ? slide.sortOrder : 0;
    }, 'sortOrder']
  );

  if (promptBlocks.length === 0) {
    throw new Error('No prompt blocks found in this scenario');
  }

  const users = await models.User.find({ 'cohorts.cohort': cohortId }).lean();

  const blockResponsesMap = {};
  each(promptBlocks, (block) => {
    blockResponsesMap[String(block.ref)] = [];
  });

  for (const user of users) {
    const { blockResponses, stages } = await buildUserScenarioResponse({ userId: user._id, scenarioId, slidesByRef, blocksByRef }, context);

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
          const stage = find(stages, (s) => String(s.slideRef) === String(block.slideRef));
          const feedbackItems = stage?.feedbackItems || [];

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

  const agent = createAgent({ quality: 'large' });

  agent.addSystemMessage(`
    You are an educational analytics assistant helping facilitators understand student responses across an entire scenario.
    You will be given multiple prompts/questions from a scenario, along with student responses and any AI feedback given.

    Provide a concise summary that highlights:
    - An overall summary of student engagement and response quality across the scenario
    - Common themes and notable differences across all prompts
    - For text input prompts, analyse the tone of voice used by students (formality, engagement level, writing style patterns)
    - Cross-prompt patterns such as consistency in quality, progression through the scenario, and areas of confusion
    - If AI feedback was provided, note any patterns in the feedback given
    - Do not reference specific responses like Response 1 or Response 2 as they are not ordered and this will confuse the user, instead give an overview

    Keep the summary clear and actionable for the facilitator.

    The JSON structured returned should be:
    {"summary": ""}
  `);

  agent.addUserMessage(`
    ## Scenario prompts and responses
    Below are all the prompts in this scenario, each followed by the student responses collected.
    ${promptContent}
  `);

  const response = await agent.run();

  return response;

};
