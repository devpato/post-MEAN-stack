const MONGOOSE = require('mongoose');
const UNIQUE_VALIDATOR = require('mongoose-unique-validator');

const USER_SCHEMA = MONGOOSE.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

USER_SCHEMA.plugin(UNIQUE_VALIDATOR);

module.exports = MONGOOSE.model('User', USER_SCHEMA);
