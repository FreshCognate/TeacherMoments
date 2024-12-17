import mongoose from 'mongoose';

const schema = {
  type: { type: String, default: 'trigger' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  elementRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  triggerType: { type: String, enum: ['SLIDE', 'BLOCK'], required: true },
  sortOrder: { type: Number },
  event: { type: String, enum: ['ON_INIT', 'ON_SHOW'], required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;