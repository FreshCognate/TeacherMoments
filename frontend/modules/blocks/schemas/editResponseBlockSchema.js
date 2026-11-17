export default {
  contentSchema: {
    responseRef: {
      type: 'ResponseSelector',
      label: 'Previous response',
    },
  },
  settingsSchema: {
    name: {
      type: 'Text',
      label: 'Name',
      help: 'Optional. Shown in responses instead of "Block 1".'
    }
  }
}