const MONGOOSE = require('mongoose');

const POST_SCHEMA = MONGOOSE.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
  //creator: { type: MONGOOSE.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = MONGOOSE.model('Post', POST_SCHEMA);
