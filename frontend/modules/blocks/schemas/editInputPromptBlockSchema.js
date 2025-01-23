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