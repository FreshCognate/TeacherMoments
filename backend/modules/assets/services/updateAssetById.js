export default async (props, options, context) => {

  const { assetId, update } = props;

  const { models } = context;

  const asset = await models.Asset.findByIdAndUpdate(assetId, update, { new: true });

  if (!asset) throw { message: 'This asset does not exist', statusCode: 404 };

  return asset;

};