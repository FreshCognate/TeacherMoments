export default async (props, options, context) => {

  const { triggerId } = props;

  const { models, user } = context;

  const update = {
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: new Date(),
    updatedBy: user._id
  }

  const trigger = await models.Trigger.findByIdAndUpdate(triggerId, update, { new: true });

  if (!trigger) throw { message: 'This trigger does not exist', statusCode: 404 };

  return trigger;

};