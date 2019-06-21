const EXPRESS = require('express');
const BODY_PARSER = require('body-parser');
const APP = EXPRESS();
const MONGOOSE = require('mongoose');
const POSTS_ROUTES = require('./routes/posts');

MONGOOSE.connect(
  'mongodb+srv://super:super@cluster0-fnddg.mongodb.net/node-angular?retryWrites=true&w=majority',
  { useNewUrlParser: true }
)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection Failed');
  });

APP.use(BODY_PARSER.json());
APP.use(BODY_PARSER.urlencoded({ extended: false }));

APP.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

APP.use('/api/posts', POSTS_ROUTES);
module.exports = APP;
