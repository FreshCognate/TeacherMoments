import mongoose from 'mongoose';

const schema = {
  type: { type: String, default: 'tracking' },
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activeSlideRef: { type: String },
  stages: [],
  isComplete: { type: Boolean, default: false },
  completedAt: { type: Date },
  isConsentAcknowledged: { type: Boolean, default: false },
  consentAcknowledgedAt: { type: Date },
  hasGivenConsent: { type: Boolean, default: false },
  givenConsentAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;