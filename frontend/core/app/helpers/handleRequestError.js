import addModal from '~/core/dialogs/helpers/addModal';

export default function handleRequestError(error) {
  if (!error.response) return console.error(error);
  if (error.response.data) {
    addModal({
      type: 'dialog',
      title: 'Error',
      body: error.response.data.message,
      actions: [{
        type: 'OK',
        text: 'OK'
      }],
    });
  }
  return Promise.resolve();
}