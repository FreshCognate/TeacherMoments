import createJob from "#core/queues/helpers/createJob.js";

export default async (props, options, context) => {

  const { generateType, prompts, actions, stem, answerText, answerValue, feedbackItems } = props;
  const { user } = context;

  const newGenerateObject = {
    generateType,
    prompts,
    actions,
    stem,
    answerText,
    answerValue,
    feedbackItems,
    createdBy: user._id,
    createdAt: new Date()
  };

  createJob({
    queue: 'generate',
    name: generateType,
    job: newGenerateObject
  });

  return newGenerateObject;

};