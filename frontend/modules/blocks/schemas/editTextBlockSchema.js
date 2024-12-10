import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const title = buildLanguageSchema('title', {
  type: 'TextArea',
  label: 'Title',
  conditions: [{
    type: 'modelValueIs',
    field: 'blockType',
    values: ['TEXT'],
    shouldHideField: true,
  }],
  features: ['bold', 'italic', 'underline']
});

const body = buildLanguageSchema('body', {
  type: 'TextArea',
  label: 'Body',
  conditions: [{
    type: 'modelValueIs',
    field: 'blockType',
    values: ['TEXT'],
    shouldHideField: true,
  }],
  features: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'blockquote', 'link', 'leftAlign', 'centerAlign', 'rightAlign', 'justifyAlign', 'bulletedList', 'numberedList']
});

export default {
  ...title,
  ...body
}