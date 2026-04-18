import createJob from '#core/queues/helpers/createJob.js';

export default {
  read: async function ({ param }, context) {

    const job = await createJob({
      queue: 'upgrades',
      name: param,
      job: {
        createdBy: context.user._id,
        createdAt: new Date()
      }
    });

    return { jobId: job.id };

  }
};
