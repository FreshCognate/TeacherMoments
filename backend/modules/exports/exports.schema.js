import mongoose from 'mongoose';

const schema = {
  type: { type: String, default: 'export' },
  exportType: {
    type: String,
    enum: ['SCENARIO_RESPONSES', 'COHORT_SCENARIO', 'COHORT_USER', 'COHORT_ALL', 'USER_HISTORY'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  cohortId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: { type: String },
  filePath: { type: String },
  fileSize: { type: Number },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;
