export default async (props, options, context) => {

  const { name, fileType } = props;

  const { models, user } = context;

  const newAssetObject = {
    name,
    fileType,
    createdBy: user._id,
  };

  const asset = await models.Asset.create(newAssetObject);

  return asset;

};