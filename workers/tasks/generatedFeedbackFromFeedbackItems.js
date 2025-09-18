import createAgent from "../agents/helpers/createAgent.js";
import getSockets from "../getSockets.js";
import each from 'lodash/each.js';

export default async ({ feedbackItems, items }) => {

  const agent = createAgent({ quality: 'large' });

  let questionsAsString = "";

  each(items, (item) => {
    questionsAsString += `
      ## Question
      ${item.stem}

      ## User's answer
      ${item.textValue}
    `
  })

  let feedbackAsString = "";

  each(feedbackItems, (feedbackItem) => {
    feedbackAsString += `${feedbackItem} 
    <br>`;
  })

  agent.addSystemMessage(`
    You are a supporting coach who is guiding a learner through a set of scenarios. 
    During this scenario the learner is asked a set of questions and given feedback. 
    Based upon the users feedback and users answers to these questions, can you re-write the feedback to be more personal whilst keeping true to the feedback.
    Do not make anything up.
    The JSON structured returned should be: 
    
    {"feedback": ""}
    
    Where:
    - "feedback" = The re-written feedback based upon the questions and answers.
  `);

  agent.addUserMessage(`
      Based upon the user answering the following questions:

      ${questionsAsString}

      ## Users feedback
      ${feedbackAsString}
    `)

  const response = await agent.run()

  return response;

}
