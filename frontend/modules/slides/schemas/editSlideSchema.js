export default {
  name: {
    type: 'Text',
    label: 'Name'
  },
  navigation: {
    type: 'SlideNavigation',
    label: 'Navigation',
    options: [{
      value: 'BIDIRECTIONAL',
      text: 'Back & Next',
      description: 'This will include a back button and next button'
    }, {
      value: 'BACKWARD',
      text: 'Back',
      description: 'This forces the user to only go backwards'
    }, {
      value: 'FORWARD',
      text: 'Next',
      description: 'This forces the user to only move forwards'
    }, {
      value: 'SUBMIT',
      text: 'Submit',
      description: 'This allows the user to submit a slide and take actions'
    }]
  }
}