export default async (props, options, context) => {

  const { assetId, update } = props;

  const { models, user } = context;

  update.updatedBy = user._id;
  update.updatedAt = new Date();

  const asset = await models.Asset.findByIdAndUpdate(assetId, update, { new: true });

  if (!asset) throw { message: 'This asset does not exist', statusCode: 404 };

  return asset;

};