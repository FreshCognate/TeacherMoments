import mongoose from 'mongoose';
import getTriggerEvents from './helpers/getTriggerEvents.js';
import getTriggerActions from './helpers/getTriggerActions.js';

const schema = {
  type: { type: String, default: 'trigger' },
  ref: mongoose.Schema.Types.ObjectId,
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: 'Scenario', required: true },
  elementRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Slide', required: true },
  triggerType: { type: String, enum: ['SLIDE', 'BLOCK'], required: true },
  sortOrder: { type: Number },
  event: {
    type: String,
    enum: getTriggerEvents(),
    required: true
  },
  action: {
    type: String,
    enum: getTriggerActions(),
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
};

export default schema;