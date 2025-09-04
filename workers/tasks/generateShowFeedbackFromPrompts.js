import createAgent from "../agents/helpers/createAgent.js";
import getSockets from "../getSockets.js";
const buildFeedbackItemsString = (feedbackItems) => {
  let feedbackItemsIndex = 0;
  let feedbackItemsAsString = ``;
  for (const feedbackItem of feedbackItems) {
    console.log(feedbackItem);
    feedbackItemsAsString += `
      ## Feedback item ${feedbackItemsIndex + 1}
      _id: ${feedbackItem._id}
      text: ${feedbackItem.text}
      value: ${feedbackItem.value}
    `;
    feedbackItemsIndex++;
  }

  return feedbackItemsAsString;
}

export default async ({ stem, answerText, answerValue, feedbackItems }) => {
  console.log(stem, answerText, answerValue, feedbackItems);
  const agent = createAgent({});

  agent.addSystemMessage(`
    You are a supporting coach who is guiding a learner through a set of scenarios. 
    During this scenario the learner is asked a question and you need to give feedback based upon a few predefined feedback items.
    The JSON structured returned should be: {"_id": "The ID of the feedback item", "feedback": "Your re-written feedback based upon the feedback text and value", "reasoning": "A description of why you chose this option."}
  `);

  const feedbackItemsString = buildFeedbackItemsString(feedbackItems);

  agent.addUserMessage(`
      Based upon the user answering the following question:
  
      # Question  
      ${stem}

      # Answer
      Answer text: ${answerText}
      Answer value: ${answerValue}
  
      ## Feedback items
      ${feedbackItemsString}

      # Feedback
      Based upon the question and answer above, can you give some feedback to the user from the feedback items?
    `)

  const response = await agent.run()

  const sockets = await getSockets();

  sockets.emit(`workers:generate:generateGiveFeedbackFromPrompts`, {
    message: response
  });
}