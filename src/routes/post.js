const express = require('express');
const { body } = require('express-validator')
const postController = require('../controllers/post');
const isAuth = require('../middleware/is-auth')
const router = express.Router();

const _ = postController;
router.post('/', isAuth, _.getPosts);
router.post('/postId', _.getPostById)
router.post('/create', isAuth, [
   body('title').trim().isLength({ min: 5 }),
   body('description').trim().isLength({ min: 5 })
], _.createPost);
router.put('/update/', isAuth, _.updatePost);
router.post('/delete', isAuth, _.deletePost);

router.get('/public', _.getAllPosts)

module.exports = router;