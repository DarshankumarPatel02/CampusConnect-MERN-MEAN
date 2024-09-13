import React, { useEffect, useState, FormEvent } from 'react';
import '../styles/profile.css';

import Navigation from './Navigation';


const Profile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:3200/api/user/userDetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { username, email, id } = await response.json();
        setUsername(username);
        setEmail(email)
        setId(id)
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const requestBody = JSON.stringify({
        username: username,
        email: email
      });
      const response = await fetch(`http://localhost:3200/api/user/profile/${id}`, {
        method: 'PUT',
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setUpdateSuccess(true);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setUpdateError('Error updating user details');
    }
  };

  return (
    <>
      <Navigation />
      <div className="container profile">
        <h1>Edit Profile</h1>
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="text" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <button type="submit">Update Profile</button>
        </form>
        {updateSuccess && <div className="success-message">Profile updated successfully! 
       
            </div>}
        {updateError && <div className="error-message">{updateError}  {setTimeout(() => {
              setUpdateError('');
            }, 5000)}</div>}
      </div>
    </>

  );
};

export default Profile;