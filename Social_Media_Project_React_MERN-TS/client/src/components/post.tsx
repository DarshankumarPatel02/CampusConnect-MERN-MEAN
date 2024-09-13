import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Post.css';
import '../styles/Navigation.css';
import profilepic from '../assets/profilepic.png';
import Navigation from '../components/Navigation';

interface Post {
  _id: string;
  username: string;
  date: string;
  time: string;
  like: number;
  comments: Comment[];
  content: {
    text: string;
    images: string[];
    videos: string[];
  };
}

interface Comment {
  username: string;
  _id: string;
  comment: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [newPostVideos, setNewPostVideos] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentPostId, setCommentPostId] = useState('');
  const [username, setUsername] = useState('');
  const [openCommentPostId, setOpenCommentPostId] = useState('');
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchUsername();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3200/api/posts');
      const data = await response.json();
      const updatedPosts = data.map((post: Post) => {
        const storedComments = localStorage.getItem(`comments_${post._id}`);
        const comments = storedComments ? JSON.parse(storedComments) : post.comments;
        return {
          ...post,
          comments: comments,
        };
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:3200/api/user/username', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const createPost = async () => {
    if (newPost.trim() === '' && newPostImages.length === 0 && newPostVideos.length === 0) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3200/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          content: {
            text: newPost,
            images: newPostImages,
            videos: newPostVideos,
          },
        }),
      });
      if (response.ok) {
        setNewPost('');
        setNewPostImages([]);
        setNewPostVideos([]);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updateLikesCount = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:3200/api/posts/${postId}/like`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating likes count:', error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3200/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleComment = (postId: string) => {
    setCommentPostId(postId);
    setOpenCommentPostId(postId);
  };

  const addComment = async () => {
    try {
      const response = await fetch(`http://localhost:3200/api/posts/${commentPostId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: newComment }),
      });
      if (response.ok) {
        const updatedPosts = posts.map((post) => {
          if (post._id === commentPostId) {
            const newCommentObj = { _id: 'temp-id', username: username, comment: newComment };
            const updatedComments = [...post.comments, newCommentObj];
            localStorage.setItem(`comments_${post._id}`, JSON.stringify(updatedComments));
            return {
              ...post,
              comments: updatedComments,
            };
          }
          return post;
        });
        setPosts(updatedPosts);
        setNewComment('');
        setCommentPostId('');
        setOpenCommentPostId('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };


  const closeComments = () => {
    setOpenCommentPostId('');
  };

  return (
    <>
      <Navigation />
      <div className="container social-media-feed">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='search-input'
      />
        <div className="post create-post">
          <div className="user-profile">
            <img src={profilepic} alt="Profile" />
            <p>Create a new post</p>
          </div>
          <textarea
            className="post-content"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="post-actions">
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from((e.target as HTMLInputElement).files || []);
                const images = files.filter((file) => file.type.startsWith('image/')).map((file) => URL.createObjectURL(file));
                const videos = files.filter((file) => file.type.startsWith('video/')).map((file) => URL.createObjectURL(file));
                setNewPostImages((prevImages) => [...prevImages, ...images]);
                setNewPostVideos((prevVideos) => [...prevVideos, ...videos]);
              }}
            />
            <button className="create-post-btn" onClick={createPost}>
              Post
            </button>
          </div>
        </div>
        {posts.filter((post) => post.username.toLowerCase().includes(searchTerm.toLowerCase())).map((post) => (
          <div key={post._id} className="post">
            <div className="user-profile">
              <img src={profilepic} alt="Profile" />
              <p>{post.username}</p>
            </div>
            <hr />
            <div className="post-content">
              <p>{post.content.text}</p>
              {post.content.images.length > 0 && (
                <div className="post-images">
                  {post.content.images.map((image) => (
                    <img key={image} src={image} alt="Post Image" style={{ maxWidth: '626px', maxHeight: '417px', margin: '0 auto' }} />
                  ))}
                </div>
              )}
              {post.content.videos.length > 0 && (
                <div className="post-videos">
                  {post.content.videos.map((video) => (
                    <video
                      key={video}
                      controls
                      src={video}
                      style={{ maxWidth: '626px', maxHeight: '417px', margin: '0 auto' }}
                    />
                  ))}
                </div>
              )}
            </div>
            <hr />
            <div className="post-actions">
              <button className="like-btn" onClick={() => updateLikesCount(post._id)}>
                {post.like} Likes
              </button>
              <button className="comment-btn" onClick={() => handleComment(post._id)}>
                {post.comments.length} Comments
              </button>
              {username === post.username && (
                <button className="delete-btn" onClick={() => deletePost(post._id)}>
                  Delete Post
                </button>
              )}
            </div>
            {openCommentPostId === post._id && (
              <div className="comments-section">
                <ul className="comment-list">
                  {post.comments.slice(0, expandedComments.includes(post._id) ? undefined : 3).map((comment) => (
                    <li key={comment._id}>
                      <span className="comment-username">{comment.username}: </span>
                      <span>{comment.comment}</span>
                    </li>
                  ))}
                </ul>
                {post.comments.length > 3 && !expandedComments.includes(post._id) && (
                  <button
                    className="expand-comments-btn"
                    onClick={() => setExpandedComments((prevExpanded) => [...prevExpanded, post._id])}
                  >
                    View all comments
                    <br/>
                  </button>
                )}
                {expandedComments.includes(post._id) && (
                  <button
                    className="collapse-comments-btn"
                    onClick={() => setExpandedComments((prevExpanded) => prevExpanded.filter((id) => id !== post._id))}
                  >
                    Latest comments
                  </button>
                )}
                <textarea
                  className="comment-input"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="comment-actions">
                  <button className="add-comment-btn" onClick={addComment}>
                    Add Comment
                  </button>
                  <button className="cancel-comment-btn" onClick={closeComments}>
                    Cancel
                  </button>
                </div>
              </div>
            )}        
          </div>
        ))}
      </div>
    </>
  );
};

export default Feed;