const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  assigned_by: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: 'to-do',
    enum: ['to-do', 'in-pogress', 'completed'],
    required: true,
  },
  worker_id: {
    type: Number,
    required: true,
  },
});

jobSchema.plugin(timestamps);
const job = mongoose.model('jobs', jobSchema);
exports.job = job;
