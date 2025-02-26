import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Body',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  ...body,
  showSuggestionAs: {
    type: 'Toggle',
    label: 'Default to visible?',
    options: [{
      value: 'BUTTON',
      text: 'Button'
    }, {
      value: 'VISIBLE',
      text: 'Visible'
    }]
  },
}