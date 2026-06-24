import withConnection from '../../backend/core/databases/helpers/withConnection.js';
import getAudioTranscription from '../agents/helpers/getAudioTranscription.js';
import createTranscript from '../../backend/modules/transcripts/services/createTranscript.js';

export default async ({ assetId }) => withConnection(async (connection) => {

  const { models } = connection;
  const asset = await models.Asset.findById(assetId);

  const transcript = await getAudioTranscription({ asset });

  const transcriptVerbose = await createTranscript({ ...transcript, assetId: asset._id, createdBy: asset.createdBy }, {}, { models });

  asset.set('transcript', transcript.text);
  asset.set('transcriptVerbose', transcriptVerbose._id);

  await asset.save();

});
