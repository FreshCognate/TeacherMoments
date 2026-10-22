import createJob from '#core/queues/helpers/createJob.js';

const DELETE_DELAY_MS = 30 * 60 * 1000;

export default async (props, options, context) => {

  const { exportId } = props;
  const { models, user } = context;

  const exportRecord = await models.Export.findOne({
    _id: exportId,
    createdBy: user._id
  }).lean();

  if (!exportRecord) {
    throw { message: 'Export not found', statusCode: 404 };
  }

  await createJob({
    queue: 'exports',
    name: 'DELETE_GENERATED_EXPORT',
    delay: DELETE_DELAY_MS,
    job: {
      exportId: String(exportRecord._id)
    }
  });

  return { success: true };

};
