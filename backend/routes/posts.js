const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const POST = require('../models/post');
const MULTER = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = MULTER.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

ROUTER.post(
  '',
  MULTER({ storage: storage }).single('image'),
  (req, res, next) => {
    const NEW_POST = new POST({
      title: req.body.title,
      content: req.body.content
    });

    NEW_POST.save().then(result => {
      res.status(201).json({
        message: 'Post added succesfully',
        id: result._id
      });
      console.log('saved new image');
    });
  }
);

ROUTER.put('/:id', (req, res, next) => {
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

ROUTER.get('', (req, res, next) => {
  POST.find().then(documents => {
    res.status(200).json({
      message: 'Post fectch successfully',
      posts: documents
    });
  });
});

ROUTER.get('/:id', (req, res, next) => {
  POST.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'Post not found!' });
    }
  });
});

ROUTER.delete('/:id', (req, res, next) => {
  POST.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted' });
  });
});

module.exports = ROUTER;
