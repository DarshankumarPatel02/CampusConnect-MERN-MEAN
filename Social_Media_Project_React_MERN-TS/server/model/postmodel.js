// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    username: { type: String, required: true },
    date: { type: Date, default: Date.now },
    time: { type: String },
    like: { type: Number, default: 0 },
    comments: [{ type: String }],
    content: {
      text: { type: String },
      images: [{ type: String }],
      videos: [{ type: String }],
    },
});
  

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
