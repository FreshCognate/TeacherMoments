import mongoose from 'mongoose';

const schema = {
  type: { type: String, default: 'slide' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  originalRef: mongoose.Schema.Types.ObjectId,
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  name: { type: String, default: '' },
  slideType: { type: String, enum: ['STEP', 'SUMMARY'], default: 'STEP' },
  navigation: { type: String, enum: ['BIDIRECTIONAL', 'BACKWARD', 'FORWARD', 'SUBMIT', 'BRANCHING'], default: 'BIDIRECTIONAL' },
  sortOrder: { type: Number, required: true },
  parentRef: mongoose.Schema.Types.ObjectId,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  isLocked: { type: Boolean, default: false },
  lockedAt: { type: Date },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hasDiscussion: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;