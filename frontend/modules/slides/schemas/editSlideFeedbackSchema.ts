import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Feedback message',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  feedbackItems: {
    type: 'Array',
    label: 'Feedback responses',
    deleteTitleText: "Delete conditional feedback",
    addButtonText: "Add conditional feedback",
    itemPrefixText: 'Response',
    shouldStopLastItemDelete: true,
    subSchema: {
      ...body,
      conditions: {
        type: 'FeedbackItemConditions',
        label: 'Show this feedback when the user:'
      }
    }
  },
  shouldGenerateFeedbackFromAI: {
    type: 'Toggle',
    label: 'Generate feedback from AI',
    options: [{
      value: true,
      icon: 'confirm'
    }, {
      value: false,
      icon: 'cancel'
    }]
  }
}