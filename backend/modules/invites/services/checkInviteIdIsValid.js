export default async ({ inviteId }, options, context) => {

  const { models } = context;

  const cohort = await models.Cohort.findOne({
    invites: {
      $elemMatch: {
        token: inviteId,
        isActive: true
      }
    }
  });

  return { cohort };
}