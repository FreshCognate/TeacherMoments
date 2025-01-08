import createJob from "#core/queues/helpers/createJob.js";

export default async (props, options, context) => {

  const { generateType, prompts, actions } = props;
  const { user } = context;

  const newGenerateObject = {
    generateType,
    prompts,
    actions,
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