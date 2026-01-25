import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const summary = buildLanguageSchema('summary', {
  type: 'TextArea',
  label: 'Summary message',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  ...summary
};
