export default async ({ userId }, { models }) => {

  const user = await models.User.findById(userId).populate('teams');

  return user;

};