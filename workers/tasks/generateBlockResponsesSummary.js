import createAgent from '../agents/helpers/createAgent.js';
import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import getScenarioSlidesAndBlocksByRef from '../../backend/modules/responses/helpers/getScenarioSlidesAndBlocksByRef.js';
import buildUserScenarioResponse from '../../backend/modules/responses/helpers/buildUserScenarioResponse.js';
import find from 'lodash/find.js';
import each from 'lodash/each.js';
import uniqBy from 'lodash/uniqBy.js';
import map from 'lodash/map.js';
import getBlockText from '../helpers/getBlockText.js';

export default async ({ cohortId, scenarioId, blockRef }) => {

  const { models } = await connectDatabase();
  const context = { models };

  const { slidesByRef, blocksByRef } = await getScenarioSlidesAndBlocksByRef({ scenarioId }, context);

  const block = blocksByRef[blockRef];

  if (!block) {
    throw new Error('Block not found');
  }

  let userIds;

  if (cohortId) {
    const users = await models.User.find({ 'cohorts.cohort': cohortId }).lean();
    userIds = map(users, '_id');
  } else {
    const runs = await models.Run.find({ scenario: scenarioId, isDeleted: false }).lean();
    userIds = map(uniqBy(runs, 'user'), 'user');
  }

  let responses = [];

  for (const userId of userIds) {
    const { blockResponses, stages } = await buildUserScenarioResponse({ userId, scenarioId, slidesByRef, blocksByRef }, context);
    const blockResponse = find(blockResponses, (br) => String(br.ref) === String(blockRef));

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

        responses.push({
          response: responseText,
          feedback: feedbackItems.length ? feedbackItems.join(', ') : null
        });
      }
    }
  }

  if (responses.length < 2) {
    throw new Error('Not enough responses to generate a summary');
  }

  const blockBody = getBlockText(block, 'body');

  const agent = createAgent({ quality: 'medium' });

  let responsesAsString = '';

  each(responses, (item, index) => {
    responsesAsString += `
      ### Response ${index + 1}
      #### User's response
      ${item.response}
    `;

    if (item.feedback) {
      responsesAsString += `
      #### AI feedback given
      ${item.feedback}
      `;
    }
  });

  agent.addSystemMessage(`
    You are an educational analytics assistant helping facilitators understand student responses.
    You will be given a prompt that was asked to students, their responses, and any AI feedback that was given to them.

    Provide a concise summary that highlights:
    - Common themes across responses
    - Notable differences or unique perspectives
    - Overall quality and depth of responses
    - If AI feedback was provided, note any patterns in the feedback given
    - Do not reference specific responses like Response 1 or Response 2 as they are not ordered and this will confuse the user, instead give an overview

    Keep the summary clear and actionable for the facilitator.

    The JSON structured returned should be:
    {"summary": ""}
  `);

  agent.addUserMessage(`
    ## Prompt
    This is the question that was asked to the students.
    ${blockBody}

    ## Responses
    Each response contains the student's answer and optionally any AI feedback that was given to them after answering.
    ${responsesAsString}
  `);

  const response = await agent.run();

  return {
    ...response,
    block
  };

};
