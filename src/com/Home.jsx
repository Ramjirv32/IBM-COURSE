import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Home() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9000/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched posts:', data);
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9000/createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content
        })
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Post created successfully',
          icon: 'success',
          background: '#1A1D24',
          color: '#fff',
          timer: 2000,
          showConfirmButton: false
        });
        
       
        setTitle('');
        setContent('');
        setShowCreatePost(false);
      
        fetchPosts();
      } else {
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        background: '#1A1D24',
        color: '#fff',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleDelete = async (postId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        background: '#1A1D24',
        color: '#fff'
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:9000/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Your post has been deleted.',
            icon: 'success',
            background: '#1A1D24',
            color: '#fff',
            timer: 2000,
            showConfirmButton: false
          });
          fetchPosts(); 
        } else {
          throw new Error('Failed to delete post');
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        background: '#1A1D24',
        color: '#fff'
      });
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setShowCreatePost(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9000/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content
        })
      });

      if (response.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Post updated successfully',
          icon: 'success',
          background: '#1A1D24',
          color: '#fff',
          timer: 2000,
          showConfirmButton: false
        });
        
        setTitle('');
        setContent('');
        setShowCreatePost(false);
        setEditingPost(null);
        fetchPosts();
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        background: '#1A1D24',
        color: '#fff'
      });
    }
  };

  const handleSubmit = editingPost ? handleUpdate : handleCreatePost;

  return (
    <div className="relative min-h-screen bg-[#0F1117]">
      <button 
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-8 right-8 bg-white text-[#0F1117] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
      >
        Create Post
      </button>

      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1D24] p-6 rounded-lg w-full max-w-lg mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              <button 
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Title
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-[#0F1117] border border-gray-700 rounded-lg text-white"
                  placeholder="Enter post title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Content
                </label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 bg-[#0F1117] border border-gray-700 rounded-lg text-white h-32"
                  placeholder="Write your post content..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-[#0F1117] rounded-lg hover:bg-gray-100"
                >
                  {editingPost ? 'Update' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar />
      <div className="bg-[#0F1117] text-white min-h-screen pt-16 px-4">
        <div className="max-w-6xl mx-auto">
       
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold tracking-tight mb-4">Welcome to the Social Media Dashboard App!</h1>
            <p className="text-gray-400 text-lg mb-8">Explore and manage your social media accounts in one place.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-5 rounded-lg transition-colors">
                FACESNAP
              </button>
              <button className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-5 rounded-lg transition-colors">
                INSTABOOK
              </button>
              <button className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-5 rounded-lg transition-colors">
                TWEETCHAT
              </button>
            </div>
            <button  
              onClick={() => setShowCreatePost(true)}
              className="bg-[#1A1D24] hover:bg-[#2A2D34] text-white font-medium py-2.5 px-8 rounded-lg border border-gray-700 transition-colors"
            >
              createPost
            </button>
          </div>

  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-[#1A1D24] rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  {post.author && post.author.email && 
                   JSON.parse(localStorage.getItem('user'))?.email === post.author.email && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 mb-4">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {post.author?.username || 'Anonymous'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

         
          {posts.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              No posts yet. Be the first to create one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home; 