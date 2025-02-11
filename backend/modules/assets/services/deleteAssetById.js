export default async (props, options, context) => {

  const { assetId } = props;

  const { models, user } = context;

  const asset = await models.Asset.findByIdAndUpdate(assetId, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: user._id
  }, { new: true });

  if (!asset) throw { message: 'This asset does not exist', statusCode: 404 };

  return asset;

};