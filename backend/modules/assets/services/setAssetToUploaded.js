export default async (props, options, context) => {

  const { assetId } = props;

  const { models } = context;

  const asset = await models.Asset.findByIdAndUpdate(assetId, { isUploading: false }, { new: true });

  if (!asset) throw { message: 'This asset does not exist', statusCode: 404 };

  return asset;

};