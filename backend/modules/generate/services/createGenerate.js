import createJob from "#core/queues/helpers/createJob.js";

export default async (props, options, context) => {

  const { generateType, userText, promptText } = props;
  const { user } = context;

  let newGenerateObject = {
    generateType,
    createdBy: user._id,
    createdAt: new Date()
  };

  switch (generateType) {
    case 'USER_INPUT_PROMPT_MATCHES_CONDITION_PROMPT':
      newGenerateObject.userText = userText;
      newGenerateObject.promptText = promptText;
      break;
  }

  createJob({
    queue: 'generate',
    name: generateType,
    job: newGenerateObject
  });

  return newGenerateObject;

};