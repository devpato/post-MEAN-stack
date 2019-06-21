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

  NEW_POST.save().then(result => {
    res.status(201).json({
      message: 'Post added succesfully',
      id: result._id
    });
  });
});

APP.put('/api/posts/:id', (req, res, next) => {
  const UPDATED_POST = new POST({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  POST.updateOne({ _id: req.params.id }, UPDATED_POST).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Update Successful' });
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

APP.get('/api/posts/:id', (req, res, next) => {
  POST.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'Post not found!' });
    }
  });
});

APP.delete('/api/posts/:id', (req, res, next) => {
  POST.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted' });
  });
});

module.exports = APP;
