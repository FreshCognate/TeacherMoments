export default {
  name: {
    type: 'Text',
    label: 'Name'
  },
  hasNavigateBack: {
    type: 'Toggle',
    label: 'Allow user to navigate back',
    size: 'sm',
    options: [{
      value: false,
      text: 'No'
    }, {
      value: true,
      text: 'Yes'
    }]
  }
  // slideType: {
  //   type: 'Toggle',
  //   label: 'Type',
  //   size: 'sm',
  //   options: [{
  //     value: 'STEP',
  //     text: 'Step'
  //   }, {
  //     value: 'SUMMARY',
  //     text: 'Summary'
  //   }]
  // }
}