import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const placeholder = buildLanguageSchema('placeholder', {
  type: 'Text',
  label: 'Placeholder'
});

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Question',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

const answerText = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Choose this feedback if...'
})

const feedbackText = buildLanguageSchema('feedback', {
  type: 'TextArea',
  label: 'Text',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
})

export default {
  inputType: {
    type: 'Toggle',
    label: 'Input type',
    help: 'Decide which input type the learner is presented with.',
    size: 'sm',
    options: [{
      value: 'AUDIO',
      text: 'Audio'
    }, {
      value: 'TEXT',
      text: 'Text'
    }]
  },
  inputTypeWarning: {
    type: 'Alert',
    alertType: 'info',
    alertText: 'A text element will display if the users browser does not support audio.',
    conditions: [{
      type: 'modelValueIs',
      field: 'inputType',
      values: ['AUDIO', 'AUDIO_AND_TEXT'],
      shouldHideField: true
    }]
  },
  ...body,
  ...placeholder,
  options: {
    type: 'Array',
    label: 'Feedback',
    addButtonText: 'Add feedback',
    subSchema: {
      ...feedbackText,
      ...answerText,
      value: {
        type: 'Text',
        label: 'Value'
      }
    }
  }
}