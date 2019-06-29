const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const PostsController = require('../controllers/posts');
const extractFile = require('../middleware/check-auth');

router.post('', checkAuth, extractFile, PostsController.createPost);
router.put('/:id', checkAuth, extractFile, PostsController.updatePost);
router.get('', PostsController.getPosts);
router.get('/:id', PostsController.getPost);
router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;
