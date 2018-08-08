const express = require('express');
const router = express.Router();
const postController = require('../controllers/post')
const checkAuth = require("../middleware/check-auth")
const extractFile = require("../middleware/file")




router.post('',checkAuth,extractFile, postController.addPost);

router.put('/:id',checkAuth, extractFile, postController.editPost);

router.get('', postController.getPosts);

router.get('/:id', postController.getPost);

router.delete('/:id',checkAuth, postController.deletePost);

module.exports = router;
