import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  _id: string;
  username: string;
  comment: string;
}


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  comments: Comment[] = []; // Make sure to initialize this array
  
  posts: Post[] = [];
  newPost = '';
  newPostImages: string[] = [];
  newPostVideos: string[] = [];
  newComment = '';
  commentPostId = '';
  username = '';
  openCommentPostId = '';
  expandedComments: string[] = [];
  searchTerm = '';
  filteredPosts: Post[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPosts();
    this.fetchUsername();
  }

  fetchPosts(): void {
  this.http.get<Post[]>('http://localhost:3200/api/posts').subscribe(
    data => {
      const updatedPosts = data.map((post: Post) => {
        const storedComments = localStorage.getItem(`comments_${post._id}`);
        const comments = storedComments ? JSON.parse(storedComments) : post.comments;
        return {
          ...post,
          comments: comments
        };
      });
      this.posts = updatedPosts;
      this.filteredPosts = this.posts;
      // Fetch comments for each post and associate them
      this.posts.forEach(post => {
        this.http.get<Comment[]>(`http://localhost:3200/api/posts/${post._id}/comments`).subscribe(
          comments => {
            post.comments = comments;
          },
          error => {
            console.error(`Error fetching comments for post ${post._id}:`, error);
          }
        );
      });
    },
    error => {
      console.error('Error fetching posts:', error);
    }
  );
  }

  fetchUsername(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<any>('http://localhost:3200/api/user/username', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        data => {
          this.username = data.username;
        },
        error => {
          console.error('Error fetching username:', error);
        }
      );
    }
  }

  createPost(): void {
    if (this.newPost.trim() === '' && this.newPostImages.length === 0 && this.newPostVideos.length === 0) {
      return;
    }

    this.http.post('http://localhost:3200/api/posts', {
      username: this.username,
      content: {
        text: this.newPost,
        images: this.newPostImages,
        videos: this.newPostVideos
      }
    }).subscribe(
      () => {
        this.newPost = '';
        this.newPostImages = [];
        this.newPostVideos = [];
        this.fetchPosts();
      },
      error => {
        console.error('Error creating post:', error);
      }
    );
  }

  searchPosts(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredPosts = this.posts; // Show all posts if search term is empty
      return;
    }

    this.filteredPosts = this.posts.filter(post => {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      const postUserName = post.username.toLowerCase();
      return postUserName.includes(lowerCaseSearchTerm);
    });
  }

  updateLikesCount(postId: string): void {
    this.http.put(`http://localhost:3200/api/posts/${postId}/like`, {}).subscribe(
      () => {
        this.fetchPosts();
      },
      error => {
        console.error('Error updating likes count:', error);
      }
    );
  }

  deletePost(postId: string): void {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:3200/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(
      () => {
        this.fetchPosts();
      },
      error => {
        console.error('Error deleting post:', error);
      }
    );
  }

  handleComment(postId: string): void {
    this.commentPostId = postId;
    this.openCommentPostId = postId;
  }

  addComment(): void {
  this.http.post(`http://localhost:3200/api/posts/${this.commentPostId}/comments`, {
    comment: this.newComment
  }).subscribe(
    () => {
      this.fetchPosts();
      this.newComment = '';
      this.commentPostId = '';
      this.openCommentPostId = '';
    },
    error => {
      console.error('Error adding comment:', error);
    }
  );
}


  closeComments(): void {
    this.openCommentPostId = '';
  }

  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files: File[] = Array.from(target.files as FileList);
    
    const images = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => URL.createObjectURL(file));
    
    const videos = files
      .filter(file => file.type.startsWith('video/'))
      .map(file => URL.createObjectURL(file));
  
    this.newPostImages.push(...images);
    this.newPostVideos.push(...videos);
  }
   
  
  expandComments(postId: string): void {
    this.expandedComments.push(postId);
  }

  collapseComments(postId: string): void {
    this.expandedComments = this.expandedComments.filter(id => id !== postId);
  }
}

