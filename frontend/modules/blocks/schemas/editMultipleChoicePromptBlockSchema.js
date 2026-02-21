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

const optionText = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Option text',
  tooltip: 'This is the text that is displayed within an option for the user to select'
});

const feedbackText = buildLanguageSchema('feedback', {
  type: 'TextArea',
  label: 'Feedback',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList'],
  conditions: [{
    type: 'modelValueIs',
    field: 'inputType',
    values: ['AUDIO', 'AUDIO_AND_TEXT'],
    shouldHideField: true
  }]
});

export default {
  contentSchema: {
    ...body,
    options: {
      type: 'Array',
      label: 'Response options',
      deleteTitleText: "Delete option",
      addButtonText: "Add option",
      shouldStopLastItemDelete: true,
      subSchema: {
        ...optionText,
        ...feedbackText,
        value: {
          type: 'Text',
          label: 'Option value',
          tooltip: "This must be filled out and be unique from the other options in this block. This value is also stored for analytics purposes."
        }
      }
    }
  },
  settingsSchema: {
    name: {
      type: 'Text',
      label: 'Name',
      help: 'An optional name to help identify this block in analytics.'
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
    isMultiSelect: {
      type: 'Toggle',
      label: 'Mutliple options can be selected',
      size: 'sm',
      options: [{
        value: false,
        text: 'No'
      }, {
        value: true,
        text: 'Yes'
      }]
    },
  }
}