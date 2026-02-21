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
      help: 'An optional name to help identify this block in analytics.'
    }
  }
}