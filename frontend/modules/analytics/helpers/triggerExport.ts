import axios from 'axios';
import getSockets from '~/core/sockets/helpers/getSockets';
import addToast from '~/core/dialogs/helpers/addToast';
import handleRequestError from '~/core/app/helpers/handleRequestError';

interface ExportParams {
  exportType: string;
  scenarioId?: string;
  cohortId?: string;
  userId?: string;
}

export default async (params: ExportParams) => {
  try {
    const response = await axios.post('/api/exports', params);
    const { jobId, export: exportRecord } = response.data;

    addToast(
      { title: 'Generating export...', body: 'Your CSV is being prepared', icon: 'syncing', timeout: 60000 },
      (event: string, { removeToast }: any) => {
        if (event === 'INIT') {
          getSockets().then((connection: any) => {
            const eventName = `workers:exports:${jobId}`;

            connection.on(eventName, async (data: any) => {
              if (data.event === 'EXPORT_COMPLETED') {
                connection.off(eventName);
                removeToast({});
                const downloadResponse = await axios.get(`/api/exports/${exportRecord._id}`);
                if (downloadResponse.data.downloadUrl) {
                  window.open(downloadResponse.data.downloadUrl, '_blank');
                  await axios.delete(`/api/exports/${exportRecord._id}`);
                }
                addToast({ title: 'Export ready', body: 'Your download has started', icon: 'confirm', timeout: 5000 }, () => { });
              }

              if (data.event === 'EXPORT_FAILED') {
                connection.off(eventName);
                removeToast({});
                addToast({ title: 'Export failed', body: 'Something went wrong', icon: 'warning', timeout: 5000 }, () => { });
              }
            });
          });
        }
      }
    );
  } catch (error) {
    handleRequestError(error);
  }
};
