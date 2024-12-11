import mongoose from 'mongoose';
import Schema from './blocks.schema.js';

const ModelSchema = mongoose.Schema(Schema, { usePushEach: true });

ModelSchema.index({
  "name": "text"
}, { background: true });

ModelSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

ModelSchema.post('save', async function (doc) {
  if (this.wasNew && !doc.ref) {
    doc.ref = doc._id;
    await doc.save();
  }
});

export default ModelSchema;