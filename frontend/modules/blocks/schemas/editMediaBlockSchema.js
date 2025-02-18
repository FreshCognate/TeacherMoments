import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const caption = buildLanguageSchema('caption', {
  type: 'Text',
  label: 'Caption'
});

const asset = buildLanguageSchema('asset', {
  type: 'AssetSelector',
  label: 'Image',
  fileTypes: ['image'],
  maxFiles: 1
});

export default {
  mediaCompleteOn: {
    type: 'Toggle',
    label: 'Media is complete when',
    size: 'sm',
    options: [{
      value: 'ON_START',
      text: 'Started'
    }, {
      value: 'ON_END',
      text: 'Finished'
    }]
  }
}