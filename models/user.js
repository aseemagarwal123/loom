const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    unique: true,
  },
  last_name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['worker', 'admin'],
    required: true,
  },
});

userSchema.plugin(timestamps);
userSchema.plugin(AutoIncrement, {inc_field: 'id'});
const user = mongoose.model('users', userSchema);
exports.user = user;
