import axios from 'axios';
import getFileDimensions from './getFileDimensions';
import getSockets from '~/core/sockets/helpers/getSockets';

export default async ({ file }, callback = () => { }) => {
  try {

    const { width, height, orientation } = await getFileDimensions(file);

    const assetResponse = await axios.post('/api/assets', { name: file.name, width, height, orientation, mimetype: file.type });

    const { signedUrl, asset } = assetResponse.data;

    callback('ASSET_UPLOADING', { asset });

    await axios.put(signedUrl, file, {
      headers: {
        "x-amz-acl": "public-read",
        "Content-Type": file.type
      },
      onUploadProgress: (event) => {
        callback('ASSET_UPLOADING_PROGRESS', { progress: Math.round(event.progress * 100) });
      }
    });

    const uploadedResponse = await axios.put(`/api/assets/${asset._id}`, { isUploading: false });

    const sockets = await getSockets();

    sockets.on(`workers:assets:${uploadedResponse.data.jobId}`, (payload) => {
      callback(payload.event, payload.message)
    })

    callback('ASSET_UPLOADED');
  } catch (error) {
    callback('ASSET_ERRORED', error);
  }

}