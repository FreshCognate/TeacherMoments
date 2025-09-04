import axios from 'axios';
import getSockets from '~/core/sockets/helpers/getSockets';

export default async ({ generateType, payload }) => {
  return new Promise(async (resolve) => {

    const response = await axios.post('/api/generate', {
      generateType,
      payload
    });

    const sockets = await getSockets();

    sockets.on(`workers:generate:${response.data.jobId}`, (payload) => {
      if (payload.event === 'GENERATED') {
        resolve(payload);
      }
    });

  });

}