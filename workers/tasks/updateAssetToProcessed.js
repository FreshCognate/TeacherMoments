import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';

export default async ({ assetId }) => {

  const { models } = await connectDatabase();
  await models.Asset.findByIdAndUpdate(assetId, { hasBeenProcessed: true, isProcessing: false, processedAt: new Date() });

}