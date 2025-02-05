import mongoose from 'mongoose';
import textAreaSchema from '#core/app/textArea.schema.js';
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';

const title = buildLanguageSchema('title', { type: String, default: '' });
const description = buildLanguageSchema('description', textAreaSchema);
const consent = buildLanguageSchema('consent', textAreaSchema);
const summary = buildLanguageSchema('summary', textAreaSchema);

const schema = {
  type: { type: String, default: 'scenario' },
  name: { type: String, default: '', required: true },
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  ...title,
  ...description,
  ...consent,
  ...summary,
  accessType: { type: String, enum: ['PUBLIC', 'PRIVATE'] },
  isExample: { type: Boolean, default: false },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['AUTHOR', 'OWNER'] }
  }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;