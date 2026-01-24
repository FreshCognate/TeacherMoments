import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const consent = buildLanguageSchema('consent', {
  type: 'TextArea',
  label: 'Consent agreement',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  ...consent
};
