import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const title = buildLanguageSchema('title', {
  type: 'Text',
  label: 'Title',
  help: 'Display when a participant is taking this scenario'
});

const description = buildLanguageSchema('description', {
  type: 'TextArea',
  label: 'Description',
  help: 'Shown under the name on scenario cards.',
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  name: {
    type: 'Text',
    label: 'Name'
  },
  ...title,
  ...description,
  accessType: {
    type: 'Toggle',
    label: 'Access type',
    options: [{
      value: 'PRIVATE',
      text: 'Private'
    }, {
      value: 'PUBLIC',
      text: 'Public'
    }]
  }
}