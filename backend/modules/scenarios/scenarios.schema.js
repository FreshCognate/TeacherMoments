import mongoose from 'mongoose';
import textAreaSchema from '#core/app/textArea.schema.js';
import buildLanguageSchema from '#core/app/helpers/buildLanguageSchema.js';
import getDefaultScenarioSummaryText from './helpers/getDefaultScenarioSummaryText.js';
import getDefaultScenarioConsentText from './helpers/getDefaultScenarioConsentText.js';

const title = buildLanguageSchema('title', { type: String, default: '' });
const description = buildLanguageSchema('description', textAreaSchema);
const consent = buildLanguageSchema('consent', {
  ...textAreaSchema, default: getDefaultScenarioConsentText()
});
const summary = buildLanguageSchema('summary', { ...textAreaSchema, default: getDefaultScenarioSummaryText() });

const schema = {
  type: { type: String, default: 'scenario' },
  name: { type: String, default: '', required: true },
  originalScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' },
  ...title,
  ...description,
  ...consent,
  ...summary,
  accessType: { type: String, enum: ['PUBLIC', 'PRIVATE'] },
  isExample: { type: Boolean, default: false },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  collaborators: [{
    _id: false,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['AUTHOR', 'OWNER'] }
  }],
  cohorts: [{
    _id: false,
    cohort: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cohort',
      required: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hasChanges: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  publishLink: { type: String },
  publishedAt: { type: Date },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
};

export default schema;