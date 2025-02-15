import mongoose from 'mongoose';
import getMimeTypes from './helpers/getMimeTypes.js';
import getFileTypes from './helpers/getFileTypes.js';

const schema = {
  type: { type: String, default: 'asset' },
  name: { type: String, required: true },
  label: String,
  description: String,
  extension: String,
  fileType: { type: String, enum: getFileTypes() },
  size: Number,
  mimetype: { type: String, enum: getMimeTypes() },
  sizes: [Number],
  orientation: { type: String, enum: ['landscape', 'portrait'] },
  width: { type: Number },
  height: { type: Number },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  isUploading: { type: Boolean, default: false },
  isProcessing: { type: Boolean, default: false },
  hasBeenProcessed: { type: Boolean, default: false },
  isAIGenerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;