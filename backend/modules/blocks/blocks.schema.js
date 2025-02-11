import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
import textAreaSchema from '#core/app/textArea.schema.js';
import mongoose from 'mongoose';
const title = buildLanguageSchema('title', textAreaSchema);
const body = buildLanguageSchema('body', textAreaSchema);
const placeholder = buildLanguageSchema('placeholder', { type: String, default: '' });
const text = buildLanguageSchema('text', { type: String, default: '' });
const feedback = buildLanguageSchema('feedback', textAreaSchema);

const schema = {
  type: { type: String, default: 'block' },
  ref: mongoose.Schema.Types.ObjectId,
  slideRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  originalRef: mongoose.Schema.Types.ObjectId,
  originalSlideRef: mongoose.Schema.Types.ObjectId,
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  blockType: { type: String, enum: ['TEXT', 'IMAGES', 'ANSWERS_PROMPT', 'INPUT_PROMPT', 'ACTIONS_PROMPT'], default: 'TEXT' },
  sortOrder: { type: Number },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  ...title,
  ...body,
  ...placeholder,
  isMultiSelect: { type: Boolean, default: false },
  options: {
    type: [{
      ...text,
      ...feedback,
      value: { type: String },
    }], default: [{ "en-US-text": "" }]
  },
  actions: {
    type: [{
      ...text,
      actionType: { type: String, default: 'COMPLETE_SLIDE', enum: ['RESET_SCENARIO', 'COMPLETE_SLIDE'] },
      actionValue: { type: String, default: '' },
    }], default: [{ "en-US-text": "Next" }]
  },
  feedbackItems: {
    type: [{
      ...text,
      value: { type: String }
    }],
    default: [{ "en-US-text": "" }]
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