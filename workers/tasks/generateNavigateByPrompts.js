import createAgent from "../agents/helpers/createAgent.js";
import getSockets from "../getSockets.js";

const buildQuestionsString = (prompts) => {
  let promptIndex = 0;
  let questionsString = ``;
  for (const prompt of prompts) {
    console.log(prompt);
    questionsString += `
      ## Question ${promptIndex + 1}
      Stem: ${prompt.stem}
      Answer: ${prompt.answer}

    `;
    promptIndex++;
  }

  return questionsString;
}

const buildActionsString = (actions) => {
  let actionIndex = 0;
  let actionsAsString = ``;
  for (const action of actions) {
    console.log(action);
    actionsAsString += `
      ## Action ${actionIndex + 1}
      _id: ${action._id}
      context: ${action.context}
    `;
    actionIndex++;
  }

  return actionsAsString;
}

export default async ({ prompts, actions }) => {
  const agent = createAgent({});
  agent.addSystemMessage(`
    You are a supporting coach who is guiding a learner through a set of scenarios. 
    During this scenario scene the learner is asked a set of questions and you need to suggest a navigation path based upon a few options.
    The JSON structured returned should be: {"_id": "The ID of the navigation action", "reasoning": "A description of why you chose this option."}
  `);

  const questions = buildQuestionsString(prompts);
  const actionsItems = buildActionsString(actions);

  agent.addUserMessage(`
    Based upon the user answering the following questions:

    # Questions  
    ${questions}

    # Navigation
    Based upon the questions above, can you suggest from the following which next scene the learner should go to based upon the action context?

    ## Actions
    ${actionsItems}
  `)

  const response = await agent.run()

  const sockets = await getSockets();

  sockets.emit(`workers:generate:generateNavigateByPrompts`, {
    message: response
  });

}