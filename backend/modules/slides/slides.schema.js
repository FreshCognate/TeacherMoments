import mongoose, { Schema } from 'mongoose';
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
import textAreaSchema from '#core/app/textArea.schema.js';
const body = buildLanguageSchema('body', textAreaSchema);

const feedbackItemSchema = new Schema({
  ...body,
  elementRef: { type: mongoose.Schema.Types.ObjectId },
  conditions: [{
    prompts: [{
      ref: mongoose.Schema.Types.ObjectId,
      options: [{ type: String, default: [] }],
      text: { type: String, default: '' },
    }]
  }]
})

const schema = {
  type: { type: String, default: 'slide' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  originalRef: mongoose.Schema.Types.ObjectId,
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  name: { type: String, default: '' },
  slideType: { type: String, enum: ['STEP', 'SUMMARY'], default: 'STEP' },
  sortOrder: { type: Number, required: true },
  stemRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Stem' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  isLocked: { type: Boolean, default: false },
  lockedAt: { type: Date },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hasDiscussion: { type: Boolean, default: false },
  hasFeedback: {
    type: Boolean,
    default: false
  },
  shouldGenerateFeedbackFromAI: {
    type: Boolean,
    default: false
  },
  feedbackItems: {
    type: [feedbackItemSchema],
    default: []
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