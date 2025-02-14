export default async (props, options, context) => {

  const { name, fileType } = props;

  const { models, user } = context;

  const newAssetObject = {
    name,
    fileType,
    createdBy: user._id,
    isUploading: true
  };

  const asset = await models.Asset.create(newAssetObject);

  // When creating a new asset we should create a signing url.

  return asset;

};