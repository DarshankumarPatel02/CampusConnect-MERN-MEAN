import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/adminpanel.css';

type Contact = {
  _id: string;
  name: string;
  email: string;
  message: string;
};

const AdminPanel: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (loggedIn) {
      fetchContacts();
    }
  }, [loggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty username and password
    if (!username) {
      setErrorMessage('Username is required');
    } else if (!password) {
      setErrorMessage('Password is required');
    } else if (username === 'admin' && password === 'admin') {
      // Set logged in state to true
      setLoggedIn(true);
    } else {
      setErrorMessage('Invalid credentials');
    }
  };

  const handleLogout = () => {
    // Clear the JWT token from local storage
    localStorage.removeItem('token');

    // Set logged in state to false
    setLoggedIn(false);
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');

      // Set the authorization header with the JWT token
      const response = await axios.get('http://localhost:3200/api/contact', {
        headers: {
          Authorization: token,
        },
      });

      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (contactId: string) => {
    try {
      const token = localStorage.getItem('token');

      // Set the authorization header with the JWT token
      await axios.delete(`http://localhost:3200/api/contact/${contactId}`, {
        headers: {
          Authorization: token,
        },
      });

      fetchContacts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = (contactId: string) => {
    const selectedIndex = selectedContacts.indexOf(contactId);

    if (selectedIndex === -1) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      const updatedSelectedContacts = selectedContacts.filter((id) => id !== contactId);
      setSelectedContacts(updatedSelectedContacts);
    }
  };

  if (!loggedIn) {
    return (
      <div className="contact-container">
        <h1>Admin Panel</h1>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="contact-btn">
            Login
          </button>
          <div className="text-center mt-3">
                <a href="/login">User Login</a>
            </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <button className="contact-btn" onClick={handleLogout}>
        Logout
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.message}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact._id)}
                  onChange={() => handleSelect(contact._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="contact-btn"
        onClick={() => {
          selectedContacts.forEach((contactId: string) => handleDelete(contactId));
          setSelectedContacts([]);
        }}
        disabled={selectedContacts.length === 0}
      >
        Delete Selected Contacts
      </button>
    </div>
  );
};

export default AdminPanel;
