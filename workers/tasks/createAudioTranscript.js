import connectDatabase from '../../backend/core/databases/helpers/connectDatabase.js';
import getAudioTranscription from '../agents/helpers/getAudioTranscription.js';

export default async ({ assetId }) => {

  const { models } = await connectDatabase();
  const asset = await models.Asset.findById(assetId);

  const transcript = await getAudioTranscription({ asset });

  asset.set('transcript', transcript.text)

  await asset.save();

}