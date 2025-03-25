import convertAudioToMP3 from '../tasks/convertAudioToMP3.js';
import createAssetSizes from "../tasks/createAssetSizes.js";
import updateAssetToProcessed from '../tasks/updateAssetToProcessed.js';
import getSockets from '../getSockets.js';
import '../../backend/modules/assets/index.js';

export default async (job) => {
  try {

    let sockets;

    if (job.name === 'PROCESS_ASSET_TO_MP3') {

      sockets = await getSockets();
      sockets.emit(`workers:assets:${job.parent.id}`, {
        event: 'AUDIO_PROCESSING'
      });

      await convertAudioToMP3({ assetId: job.data.assetId });

      sockets = await getSockets();
      sockets.emit(`workers:assets:${job.parent.id}`, {
        event: 'AUDIO_PROCESSED'
      });

    }
    if (job.name === 'PROCESS_ASSET_SIZES') {

      sockets = await getSockets();
      sockets.emit(`workers:assets:${job.parent.id}`, {
        event: 'IMAGES_PROCESSING'
      });

      await createAssetSizes({ assetId: job.data.assetId });

      sockets = await getSockets();
      sockets.emit(`workers:assets:${job.parent.id}`, {
        event: 'IMAGES_PROCESSED'
      });

    }
    if (job.name === 'PROCESS_ASSET') {
      await updateAssetToProcessed({ assetId: job.data.assetId });
      sockets = await getSockets();
      sockets.emit(`workers:assets:${job.id}`, {
        event: 'ASSET_PROCESSED'
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}