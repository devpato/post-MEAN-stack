const EXPRESS = require('express');
const uuidv4 = require('uuid/v4');
const BODY_PARSER = require('body-parser');
const POST = require('./models/post');
const APP = EXPRESS();
const MONGOOSE = require('mongoose');

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

APP.post('/api/posts', (req, res, next) => {
  const NEW_POST = new POST({
    title: req.body.title,
    content: req.body.content
  });

  console.log(NEW_POST);
  NEW_POST.save();
  res.status(201).json({
    message: 'Post added succesfully'
  });
});

APP.get('/api/posts', (req, res, next) => {
  POST.find().then(documents => {
    res.status(200).json({
      message: 'Post fectch successfully',
      posts: documents
    });
  });
});

module.exports = APP;
