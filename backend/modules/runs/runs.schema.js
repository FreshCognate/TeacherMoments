import mongoose from 'mongoose';

const schema = {
  type: { type: String, default: 'run' },
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activeSlideRef: { type: String },
  stages: [{
    _id: false,
    isComplete: { type: Boolean, default: false },
    slideRef: { type: String, required: true },
    feedbackItems: [],
    blocksByRef: {
      type: Map,
      of: {
        audio: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
        isAbleToComplete: { type: Boolean, default: false },
        isComplete: { type: Boolean, default: false },
        textValue: { type: String, default: "" },
        selectedOptions: [String],
        _id: false,
      }
    },
  }],
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