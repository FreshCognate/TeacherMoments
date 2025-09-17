import mongoose, { Schema } from 'mongoose';
import getTriggerActions from './helpers/getTriggerActions.js';
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
import textAreaSchema from '#core/app/textArea.schema.js';
const body = buildLanguageSchema('body', textAreaSchema);

const itemSchema = new Schema({
  ...body,
  conditions: [{
    prompts: [{
      ref: mongoose.Schema.Types.ObjectId,
      options: [{ type: String, default: [] }],
      text: { type: String, default: '' },
    }]
  }]
})

const schema = {
  type: { type: String, default: 'trigger' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  elementRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  triggerType: { type: String, enum: ['SLIDE'], required: true },
  sortOrder: { type: Number },
  action: {
    type: String,
    enum: getTriggerActions(),
    required: true
  },
  items: {
    type: [itemSchema],
    default: [{}]
  },
  shouldGenerateFeedbackFromAI: {
    type: Boolean,
    default: false
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