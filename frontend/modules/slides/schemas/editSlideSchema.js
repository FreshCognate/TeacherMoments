export default {
  name: {
    type: 'Text',
    label: 'Name'
  },
  slideType: {
    type: 'Toggle',
    label: 'Type',
    size: 'sm',
    options: [{
      value: 'STEP',
      text: 'Step'
    }, {
      value: 'SUMMARY',
      text: 'Summary'
    }]
  }
}