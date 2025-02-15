import axios from 'axios';

export default async ({ file }, callback = () => { }) => {
  try {

    const assetResponse = await axios.post('/api/assets', { name: file.name, mimetype: file.type });

    const { signedUrl, asset } = assetResponse.data;

    callback('INIT', { asset });

    await axios.put(signedUrl, file, {
      headers: {
        "x-amz-acl": "public-read",
        "Content-Type": file.type
      },
      onUploadProgress: (event) => {
        callback('PROGRESS', { progress: Math.round(event.progress * 100) });
      }
    });

    await axios.put(`/api/assets/${asset._id}`, { isUploading: false });

    callback('FINISH');
  } catch (error) {
    callback('ERROR', error);
  }

}