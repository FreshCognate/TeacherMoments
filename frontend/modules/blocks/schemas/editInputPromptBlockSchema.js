import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const placeholder = buildLanguageSchema('placeholder', {
  type: 'Text',
  label: 'Placeholder',
  help: 'Shown in the empty box when participants type their answer.'
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
  contentSchema: {
    ...body,
    ...placeholder,
    // options: {
    //   type: 'Array',
    //   label: 'Feedback',
    //   addButtonText: 'Add feedback',
    //   subSchema: {
    //     ...feedbackText,
    //     ...answerText,
    //     value: {
    //       type: 'Text',
    //       label: 'Value'
    //     }
    //   }
    // }
  },
  settingsSchema: {
    name: {
      type: 'Text',
      label: 'Name',
      help: 'Optional. Shown in responses instead of "Block 1".'
    },
    isRequired: {
      type: 'Toggle',
      label: 'Required to complete slide',
      options: [{
        value: true,
        icon: 'confirm'
      }, {
        value: false,
        icon: 'cancel'
      }]
    },
    requiredLength: {
      type: 'Text',
      label: 'Minimum required length',
      help: 'Sets a minimum character count for the response. This applies to both text and audio inputs.',
      textType: 'number',
      size: 'sm',
      conditions: [{
        type: 'modelValueIs',
        field: 'isRequired',
        values: [true],
        shouldHideField: true
      }]
    },
    inputType: {
      type: 'Toggle',
      label: 'Input type',
      help: 'How participants answer: audio or typing.',
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
      alertText: "If a browser can't record audio, a text box shows instead.",
      conditions: [{
        type: 'modelValueIs',
        field: 'inputType',
        values: ['AUDIO', 'AUDIO_AND_TEXT'],
        shouldHideField: true
      }]
    },
  }
}