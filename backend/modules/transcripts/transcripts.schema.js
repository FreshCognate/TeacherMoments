import mongoose from 'mongoose';

const schema = {
  type: { type: String, default: 'transcript' },
  language: { type: String },
  duration: { type: Number },
  text: { type: String },
  segments: [],
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;