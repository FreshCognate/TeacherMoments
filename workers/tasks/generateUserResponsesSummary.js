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
import groupBy from 'lodash/groupBy.js';

const PROMPT_BLOCK_TYPES = ['INPUT_PROMPT', 'MULTIPLE_CHOICE_PROMPT'];

export default async ({ scenarioId, userId }) => {

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

  const { blockResponses, stages } = await buildUserScenarioResponse({ userId, scenarioId, slidesByRef, blocksByRef }, context);

  const blocksBySlide = groupBy(promptBlocks, 'slideRef');
  const sortedSlideRefs = sortBy(Object.keys(blocksBySlide), (slideRef) => {
    const slide = slidesByRef[slideRef];
    return slide ? slide.sortOrder : 0;
  });

  let promptContent = '';

  each(sortedSlideRefs, (slideRef) => {
    const slide = slidesByRef[slideRef];
    const slideName = slide?.name || `Slide ${slide?.sortOrder + 1}`;
    const slideBlocks = sortBy(blocksBySlide[slideRef], 'sortOrder');
    const stage = find(stages, (s) => String(s.slideRef) === String(slideRef));
    const feedbackItems = stage?.feedbackItems || [];

    promptContent += `
      ## ${slideName}
    `;

    each(slideBlocks, (block) => {
      const blockRef = String(block.ref);
      const blockResponse = find(blockResponses, (br) => String(br.ref) === blockRef);
      const blockBody = getBlockText(block, 'body');
      const blockTypeLabel = block.blockType === 'INPUT_PROMPT' ? 'Text input' : 'Multiple choice';

      promptContent += `
        ### ${blockBody}
        Block type: ${blockTypeLabel}
      `;

      if (blockResponse) {
        let responseText = '';

        if (blockResponse.textValue) {
          responseText = blockResponse.textValue;
        } else if (blockResponse.selectedOptions && blockResponse.selectedOptions.length) {
          responseText = blockResponse.selectedOptions.join(', ');
        }

        if (responseText) {
          promptContent += `
          #### User's response
          ${responseText}
          `;
        } else {
          promptContent += `
          #### User's response
          No response provided
          `;
        }
      } else {
        promptContent += `
        #### User's response
        No response provided
        `;
      }
    });

    if (feedbackItems.length) {
      promptContent += `
        ### AI feedback given for this slide
        ${feedbackItems.join(', ')}
      `;
    }
  });

  const agent = createAgent({ quality: 'large' });

  agent.addSystemMessage(`
    You are an educational analytics assistant helping facilitators understand an individual student's responses across an entire scenario.
    You will be given the prompts/questions from a scenario in order, along with the student's responses and any AI feedback they received.

    Provide a structured summary that highlights:
    - An overall assessment of the student's engagement and response quality across the scenario
    - The choices they made and their apparent reasoning
    - The depth and quality of their responses
    - Consistency across prompts and any progression or changes in approach through the scenario
    - Any prompts they did not respond to and what that might indicate
    - If AI feedback was provided, how it relates to their responses and any patterns

    The JSON structured returned should be:
    {
      "overview": "A full overview of the student's journey through the scenario, their engagement level, and overall quality of responses.",
      "sections": [
        {
          "title": "Optional title for this section",
          "content": "Detail about this aspect of the student's responses."
        }
      ],
      "summary": "Actionable takeaways and recommendations for the facilitator regarding this student."
    }

    Guidelines for each field:
    - "overview": A high-level narrative of the student's journey through the scenario.
    - "sections": Group related observations together. Each section should reference specific prompts and responses where relevant. The "title" field is optional and can be left as an empty string. The "content" field is required.
    - "summary": Concise, actionable recommendations the facilitator can act on for this student.
  `);

  agent.addUserMessage(`
    ## Student's responses across the scenario
    Below are all the prompts in this scenario in order, each followed by this student's response.
    ${promptContent}
  `);

  const response = await agent.run();

  return response;

};
