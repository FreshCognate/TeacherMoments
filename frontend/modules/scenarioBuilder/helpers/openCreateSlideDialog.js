import addModal from "~/core/dialogs/helpers/addModal"

export default (callback) => {
  addModal({
    title: 'Create slide',
    schema: {
      name: {
        type: 'Text',
        label: 'Slide name',
        shouldAutoFocus: true
      },
    },
    model: {
      name: '',
      slideRef: null,
    },
    actions: [{
      type: 'CANCEL',
      text: 'Cancel'
    }, {
      type: 'CREATE',
      text: 'Create',
      color: 'primary'
    }]
  }, callback)
}