import mongoose from 'mongoose';
import textAreaSchema from '#core/app/textArea.schema.js';
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';

const title = buildLanguageSchema('title', { type: String, default: '' });
const description = buildLanguageSchema('description', textAreaSchema);

const schema = {
  type: { type: String, default: 'cohort' },
  name: { type: String, default: '', required: true },
  originalCohort: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' },
  ...title,
  ...description,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  collaborators: [{
    _id: false,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['AUTHOR', 'OWNER'] }
  }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date },
  archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;