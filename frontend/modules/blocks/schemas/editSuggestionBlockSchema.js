import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Body',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  contentSchema: {
    ...body,
  },
  settingsSchema: {
    suggestionType: {
      type: 'Toggle',
      label: 'Suggestion type',
      options: [{
        value: 'INFO',
        text: 'Info'
      }, {
        value: 'WARNING',
        text: 'Warning'
      }]
    },
  }
}