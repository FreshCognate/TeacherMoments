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
  imagesShape: {
    type: 'Toggle',
    label: 'Image shape',
    size: 'sm',
    options: [{
      value: 'CIRCLE',
      text: 'Circle'
    }, {
      value: 'LANDSCAPE',
      text: 'Landscape'
    }, {
      value: 'PORTRAIT',
      text: 'Portrait'
    }, {
      value: 'SQUARE',
      text: 'Square'
    }, {
      value: 'NONE',
      text: 'None'
    }]
  },
  items: {
    type: 'Array',
    label: 'Images',
    addButtonText: "Add image",
    subSchema: {
      ...asset,
      ...caption,
    }
  }
}