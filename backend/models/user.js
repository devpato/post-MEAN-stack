const MONGOOSE = require('mongoose');

const USER_SCHEMA = MONGOOSE.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = MONGOOSE.model('User', USER_SCHEMA);
