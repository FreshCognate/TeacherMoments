import axios from 'axios';

export default async ({ file }, callback = () => { }) => {
  try {

    const asset = await axios.post('/api/assets', { name: file.name, mimetype: file.type });

    callback('INIT', { asset });

    const signedUrl = asset.data.signedUrl;

    await axios.put(signedUrl, file, {
      onUploadProgress: (event) => {
        callback('PROGRESS', { progress: Math.round(event.progress * 100) });
      }
    });

    callback('FINISH');
  } catch (error) {
    callback('ERROR', error);
  }

}