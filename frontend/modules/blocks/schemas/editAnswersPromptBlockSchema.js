import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const placeholder = buildLanguageSchema('placeholder', {
  type: 'Text',
  label: 'Placeholder'
});

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Question',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
})

const answerText = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Text'
})

const feedbackText = buildLanguageSchema('feedback', {
  type: 'TextArea',
  label: 'Feedback',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
})

export default {
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
  ...body,
  isMultiSelect: {
    type: 'Toggle',
    label: 'Mutliple answers can be selected',
    size: 'sm',
    options: [{
      value: false,
      text: 'No'
    }, {
      value: true,
      text: 'Yes'
    }]
  },
  options: {
    type: 'Array',
    label: 'Answers',
    addButtonText: "Add answer",
    subSchema: {
      ...answerText,
      ...feedbackText,
      value: {
        type: 'Text',
        label: 'Value'
      }
    }
  }
}