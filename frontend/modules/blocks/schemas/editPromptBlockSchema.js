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

const feedbackText = buildLanguageSchema('text', {
  type: 'Text',
  label: 'Text'
})

export default {
  ...body,
  ...placeholder,
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
  items: {
    type: 'Array',
    label: 'Answers',
    subSchema: {
      ...answerText,
      value: {
        type: 'Text',
        label: 'Value'
      }
    }
  },
  feedbackItems: {
    type: 'Array',
    label: 'Feedback',
    subSchema: {
      ...feedbackText,
      value: {
        type: 'Text',
        label: 'Value'
      }
    }
  }
}