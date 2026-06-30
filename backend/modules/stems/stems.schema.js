import mongoose from 'mongoose';
import textAreaSchema from '#core/app/textArea.schema.js';

const schema = {
  type: { type: String, default: 'stem' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  originalRef: mongoose.Schema.Types.ObjectId,
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  name: { type: String, default: '' },
  description: textAreaSchema,
  stemRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Stem' },
  slideRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide' },
  isRoot: { type: Boolean, default: false },
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
