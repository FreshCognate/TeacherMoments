import mongoose from 'mongoose';
import languages from '../../../config/languages.json' with { type: "json" };

const userSchema = {
  type: { type: String, default: 'user' },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  username: { type: String },
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'FACILITATOR', 'RESEARCHER', 'PARTICIPANT'], default: 'PARTICIPANT' },
  isAgent: { type: Boolean, default: false },
  otpCode: { type: String, select: false },
  otpAttempts: { type: Number, default: 0 },
  otpRequestCount: { type: Number, default: 0 },
  otpGeneratedAt: { type: Date },
  isLocked: { type: Boolean, default: false },
  lockedUntil: { type: Date },
  lockReason: { type: String, enum: ['TOO_MANY_ATTEMPTS', 'TOO_MANY_REQUESTS'] },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  cohorts: [{
    _id: false,
    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cohort',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstLoggedInAt: { type: Date },
  loggedInAt: { type: Date },
  selectedLanguage: { type: String, default: 'en-US', enum: Object.keys(languages) },
  updateVersion: { type: String, default: '1.0.0' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default userSchema;