import mongoose from 'mongoose';
import textAreaSchema from '#core/app/textArea.schema.js';
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';

const title = buildLanguageSchema('title', { type: String, default: '' });
const description = buildLanguageSchema('description', textAreaSchema);

const schema = {
  type: { type: String, default: 'tag' },
  tagType: { type: String, enum: ["CATEGORY", "TOPIC", "LABEL"], required: true },
  name: { type: String, default: '', required: true },
  ...title,
  ...description,
  priority: { type: Number, default: 0, min: 0, max: 99 },
  color: { type: String, default: '#454545' },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;