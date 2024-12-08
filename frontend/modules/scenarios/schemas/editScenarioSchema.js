import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const title = buildLanguageSchema('title', {
  type: 'Text',
  label: 'Title',
  help: 'Display when a participate is taking this scenario'
});

const description = buildLanguageSchema('description', {
  type: 'TextArea',
  label: 'Description',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  name: {
    type: 'Text',
    label: 'Name',
    help: 'Used whilst editing'
  },
  ...title,
  ...description,
}