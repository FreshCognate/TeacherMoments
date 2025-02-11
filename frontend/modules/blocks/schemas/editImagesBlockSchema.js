import buildLanguageSchema from "~/core/app/helpers/buildLanguageSchema";

const caption = buildLanguageSchema('caption', {
  type: 'Text',
  label: 'Caption'
});

const asset = buildLanguageSchema('asset', {
  type: 'AssetSelector',
  label: 'Image'
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