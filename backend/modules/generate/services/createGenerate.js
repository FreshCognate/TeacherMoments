import createJob from "#core/queues/helpers/createJob.js";

export default async (props, options, context) => {

  const { generateType, payload } = props;
  const { user } = context;

  let newGenerateObject = {
    generateType,
    payload,
    createdBy: user._id,
    createdAt: new Date()
  };

  const job = await createJob({
    queue: 'generate',
    name: generateType,
    job: newGenerateObject
  });

  return { jobId: job.id };

};