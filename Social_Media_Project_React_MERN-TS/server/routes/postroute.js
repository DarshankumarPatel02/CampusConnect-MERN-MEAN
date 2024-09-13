//http://localhost:3200/api/posts //to create new posts  -POST
//http://localhost:3200/api/posts //to view posts - GET
//http://localhost:3200/api/posts/{postId} //to view posts using ID - GET
//http://localhost:3200/api/posts/{postId} //to update posts using ID - PUT
//http://localhost:3200/api/posts/{postId} //to DELETE posts using ID - DELETE

// routes/postRoute.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postcontroller');

// Get all posts
router.get('/', postController.getAllPosts);

// Get a single post by ID
router.get('/:id', postController.getPostById);

// Create a new post
router.post('/', postController.createPost);

// Update a post
router.put('/:id', postController.updatePost);

// Delete a post
router.delete('/:id', postController.deletePost);

// PUT /api/posts/:postId/like
router.put('/:postId/like', postController.likePost);

// Get comments for a specific post
router.get('/:postId/comments', postController.getCommentsByPostId);

// Add a comment to a post
router.post('/:postId/comments', postController.addComment);

module.exports = router;

