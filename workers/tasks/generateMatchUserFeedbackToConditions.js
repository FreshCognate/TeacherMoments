import createAgent from "../agents/helpers/createAgent.js";
import getSockets from "../getSockets.js";
import each from 'lodash/each.js';

export default async ({ stem, usersAnswer, conditions }) => {

  const agent = createAgent({});

  let conditionsAsString = "";

  each(conditions, (condition) => {
    conditionsAsString += `
      _id: ${condition._id}
      condition: ${condition.condition}
    `
  })

  agent.addSystemMessage(`
    You are a supporting coach who is guiding a learner through a set of scenarios. 
    During this scenario the learner is asked a question and you need to match their answer to a set of predefined possible answers.
    The JSON structured returned should be: {"conditions": [{"_id": "", "reasoning": "", "score": 0}]}
    Where:
    - "_id" = The id of the condition.
    - "score" = How much on a scale of 0.1 to 1.0 that this condition matches the users input. 
      0.1 being not at all, 0.5 being a partial match and 1.0 being an exact match.
    - "reasoning" = The reason why you chose the score for this condition
  `);

  agent.addUserMessage(`
      Based upon the user answering the following question:
  
      ## Question
      ${stem}

      ## User's answer
      ${usersAnswer}

      ## Conditions
      ${conditionsAsString}
    `)

  const response = await agent.run()

  return response;

}
