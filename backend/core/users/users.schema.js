import mongoose from 'mongoose';

const userSchema = {
  type: { type: String, default: 'user' },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  username: { type: String },
  hash: { type: String, select: false },
  accessToken: { type: String, select: false },
  externalReference: { type: String },
  role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'FACILITATOR', 'PARTICIPANT'], default: 'PARTICIPANT' },
  isRegistered: { type: Boolean, default: false },
  isAgent: { type: Boolean, default: false },
  registratedAt: { type: Date },
  registrationId: String,
  forgotPasswordAt: { type: Date },
  forgotPasswordId: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstLoggedInAt: { type: Date },
  loggedInAt: { type: Date },
  selectedLanguage: { type: String, default: 'en-GB' },
  updateVersion: { type: String, default: '1.0.0' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default userSchema;