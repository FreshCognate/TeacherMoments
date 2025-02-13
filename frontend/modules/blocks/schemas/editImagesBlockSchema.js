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