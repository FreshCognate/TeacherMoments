import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const mediaAsset = buildLanguageSchema('mediaAsset', {
  type: 'AssetSelector',
  label: 'Media upload',
  fileTypes: ['video'],
  conditions: [{
    type: 'modelValueIs',
    values: ['ASSET'],
    field: 'mediaType',
    shouldHideField: true
  }]
});

export default {
  mediaCompleteOn: {
    type: 'Toggle',
    label: 'Media is complete when',
    size: 'sm',
    options: [{
      value: 'START',
      text: 'Started'
    }, {
      value: 'END',
      text: 'Finished'
    }]
  },
  mediaType: {
    type: 'Toggle',
    label: 'Media type',
    size: 'sm',
    options: [{
      value: 'ASSET',
      text: 'Upload'
    }, {
      value: 'YOUTUBE',
      text: 'YouTube'
    }],
    onUpdate: ({ update, updateFields }) => {
      console.log(update, updateFields);
    }
  },
  mediaSrc: {
    type: 'Text',
    label: 'YouTube link',
    conditions: [{
      type: 'modelValueIs',
      values: ['YOUTUBE'],
      field: 'mediaType',
      shouldHideField: true
    }]
  },
  ...mediaAsset
}