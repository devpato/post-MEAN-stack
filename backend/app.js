const EXPRESS = require('express');
const uuidv4 = require('uuid/v4');

const APP = EXPRESS();

APP.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: uuidv4(),
      title: 'MEAN app from scratch',
      content: 'This is the content of the first post'
    }
  ];
  res.status(200).json({
    message: 'Post fectch successfully',
    posts: posts
  });
});

module.exports = APP;
