import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
import textAreaSchema from '#core/app/textArea.schema.js';
import mongoose from 'mongoose';
const title = buildLanguageSchema('title', textAreaSchema);
const body = buildLanguageSchema('body', textAreaSchema);
const placeholder = buildLanguageSchema('placeholder', { type: String, default: '' });
const text = buildLanguageSchema('text', { type: String, default: '' });

const schema = {
  type: { type: String, default: 'block' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  slideRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  blockType: { type: String, enum: ['TEXT', 'PROMPT', 'ACTIONS'], default: 'TEXT' },
  promptType: { type: String, enum: ['TEXT', 'ANSWERS'], default: 'TEXT' },
  sortOrder: { type: Number },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  ...title,
  ...body,
  ...placeholder,
  actions: {
    type: [{
      ...text
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