import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');

    // console.log(token)
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="navigation-bar">
      <h2>Social Media</h2>
      <div className="navigation-links">
        <a href="/post">Home</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/contact-us">Contact Us</a>
        <a href="/profile">Profile</a>
        <a href="/career">Career</a>
        <a href="/login" onClick={logout} className="logout-link">Logout</a>
      </div>
    </div>
  );
};

export default Navigation;