import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const title = buildLanguageSchema('title', {
  type: 'TextArea',
  label: 'Title',
  features: ['bold', 'italic', 'underline']
});

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Body',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  contentSchema: {
    ...title,
    ...body
  },
  settingsSchema: {}
}