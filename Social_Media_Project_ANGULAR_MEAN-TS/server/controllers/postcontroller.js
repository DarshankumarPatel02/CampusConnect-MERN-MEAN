// controllers/postController.js
const Post = require('../model/postmodel');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { username, date, time, like, comments, content } = req.body;
    const post = new Post({
      username,
      date,
      time,
      like,
      comments,
      content,
    });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { username, date, time, like, comments, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        username,
        date,
        time,
        like,
        comments,
        content,
      },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/posts/:postId/like
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment the like count
    post.like += 1;

    // Save the updated post to the database
    await post.save();

    res.json({ message: 'Likes count updated successfully', updatedLikeCount: post.like });
  } catch (error) {
    console.error('Error updating likes count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add the comment to the post's comments array
    post.comments.push(comment);

    // Save the updated post to the database
    await post.save();

    res.json({ message: 'Comment added successfully', updatedComments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Get comments for a specific post
exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Retrieve the comments for the post
    const comments = post.comments;

    res.json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};