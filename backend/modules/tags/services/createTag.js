export default async ({ name, tagType, editorTeam }, context) => {

  const { models, user } = context;

  if (!name) throw { message: "A tag must have a name", statusCode: 400 };

  const newTagObject = {
    name,
    tagType,
    createdBy: user._id
  };

  const tag = await models.Tag.create(newTagObject);

  return tag;

};