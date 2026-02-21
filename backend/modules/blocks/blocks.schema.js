import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
import textAreaSchema from '#core/app/textArea.schema.js';
import mongoose from 'mongoose';
const title = buildLanguageSchema('title', textAreaSchema);
const body = buildLanguageSchema('body', textAreaSchema);
const placeholder = buildLanguageSchema('placeholder', { type: String, default: '' });
const text = buildLanguageSchema('text', { type: String, default: '' });
const feedback = buildLanguageSchema('feedback', textAreaSchema);
const mediaAsset = buildLanguageSchema('mediaAsset', { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' });
const asset = buildLanguageSchema('asset', { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' });
const caption = buildLanguageSchema('caption', { type: String, default: '' });

const schema = {
  type: { type: String, default: 'block' },
  ref: mongoose.Schema.Types.ObjectId,
  slideRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  originalRef: mongoose.Schema.Types.ObjectId,
  originalSlideRef: mongoose.Schema.Types.ObjectId,
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  blockType: { type: String, enum: ['TEXT', 'IMAGES', 'MEDIA', 'SUGGESTION', 'RESPONSE', 'MULTIPLE_CHOICE_PROMPT', 'INPUT_PROMPT', 'ACTIONS_PROMPT'], default: 'TEXT' },
  name: { type: String, default: '' },
  sortOrder: { type: Number },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  ...title,
  ...body,
  ...placeholder,
  isRequired: { type: Boolean, default: false },
  requiredLength: { type: Number, default: 10 },
  isMultiSelect: { type: Boolean, default: false },
  imagesShape: { type: String, enum: ['CIRCLE', 'LANDSCAPE', 'PORTRAIT', 'SQUARE', 'NONE'], default: 'NONE' },
  imagesBorderRadius: { type: Number, default: 0, enum: [0, 8] },
  inputType: { type: String, enum: ['AUDIO', 'TEXT', 'AUDIO_AND_TEXT'], default: 'AUDIO' },
  mediaCompleteOn: { type: String, enum: ['START', 'END'], default: 'END' },
  mediaType: { type: String, enum: ['YOUTUBE', 'ASSET'], default: 'ASSET' },
  mediaSrc: { type: String, default: '' },
  responseRef: { type: mongoose.Schema.Types.ObjectId },
  suggestionType: { type: String, default: 'INFO', enum: ['INFO', 'WARNING'] },
  ...mediaAsset,
  items: {
    type: [{
      ...asset,
      ...caption
    }], default: [{}]
  },
  options: {
    type: [{
      ...text,
      ...feedback,
      value: { type: String, default: '' },
    }], default: [{ "en-US-text": "" }]
  },
  actions: {
    type: [{
      ...text,
      actionType: { type: String, default: 'COMPLETE_SLIDE', enum: ['RESET_SCENARIO', 'COMPLETE_SLIDE'] },
      actionValue: { type: String, default: '' },
    }], default: [{ "en-US-text": "Next" }]
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;