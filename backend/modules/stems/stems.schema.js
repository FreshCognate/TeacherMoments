import mongoose, { Schema } from 'mongoose';
import textAreaSchema from '#core/app/textArea.schema.js';
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
const body = buildLanguageSchema('body', textAreaSchema);

const branchingOptionSchema = new Schema({
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
  type: { type: String, default: 'stem' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  originalRef: mongoose.Schema.Types.ObjectId,
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  name: { type: String, default: '' },
  description: textAreaSchema,
  stemRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Stem' },
  // @todo : Need to remove this once triggers are removed
  slideRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide' },
  isRoot: { type: Boolean, default: false },
  branchingOptions: {
    type: [branchingOptionSchema],
    default: [{}]
  },
  defaultBranchingStemRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stem',
    default: null
  },
  sortOrder: { type: Number },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;
