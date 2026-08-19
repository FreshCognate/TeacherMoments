export default async (props, options, context) => {

  const { slideRefs, deletedAt } = props;

  const { models, user, session } = context;

  if (slideRefs.length === 0) return;

  await models.Trigger.updateMany(
    { elementRef: { $in: slideRefs }, isDeleted: false },
    { isDeleted: true, deletedAt, deletedBy: user._id },
    { session }
  );

};
