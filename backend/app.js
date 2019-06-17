const EXPRESS = require('express');
const uuidv4 = require('uuid/v4');
const BODY_PARSER = require('body-parser');
const POST = require('./models/post');
const APP = EXPRESS();

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
  res.status(201).json({
    message: 'Post added succesfully'
  });
});

APP.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: uuidv4(),
      title: 'MEAN app from scratch',
      content: 'This is the content of the first post'
    },
    {
      id: uuidv4(),
      title: 'First Post',
      content: "This is the first post's content"
    },
    {
      id: uuidv4(),
      title: 'Second Post',
      content: "This is the second post's content"
    },
    {
      id: uuidv4(),
      title: 'Third Post',
      content: "This is the third post's content"
    }
  ];
  res.status(200).json({
    message: 'Post fectch successfully',
    posts: posts
  });
});

module.exports = APP;
