export default async (props, options, { models }) => {

  const { userId } = props;

  const user = await models.User.findById(userId).populate('teams');

  return user;

};