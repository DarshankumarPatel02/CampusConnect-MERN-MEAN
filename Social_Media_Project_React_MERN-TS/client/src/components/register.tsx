import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/register.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!username) {
      setErrors((prevState) => ({
        ...prevState,
        username: 'Please enter your username',
      }));
      isValid = false;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        username: '',
      }));
    }

    if (!email) {
      setErrors((prevState) => ({
        ...prevState,
        email: 'Please enter your email',
      }));
      isValid = false;
    } else if (!email.match(emailRegex)) {
      setErrors((prevState) => ({
        ...prevState,
        email: 'Please enter a valid email address',
      }));
      isValid = false;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        email: '',
      }));
    }

    if (!password) {
      setErrors((prevState) => ({
        ...prevState,
        password: 'Please enter your password',
      }));
      isValid = false;
    } else if (password.length < 6) {
      setErrors((prevState) => ({
        ...prevState,
        password: 'Password should be at least 6 characters',
      }));
      isValid = false;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        password: '',
      }));
    }

    if (!confirmPassword) {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: 'Please confirm your password',
      }));
      isValid = false;
    } else if (confirmPassword !== password) {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: 'Passwords do not match',
      }));
      isValid = false;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: '',
      }));
    }

    return isValid;
  };

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post('http://localhost:3200/api/user/', {
          name: username,
          email,
          password,
        })
        .then((res) => {
          console.log(res);
          setRegistrationStatus('Registration successful!');
          // Redirect to login page after 5 seconds
          setTimeout(() => {
            navigate('/login');
          }, 5000);
        })
        .catch((err) => {
          console.log(err?.data?.message);
          if (err?.response?.data?.message === 'Email already registered') {
            setEmailError('Email already registered');
          } else {
            alert(err?.response?.data?.message);
          }
        });
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <hr />
      {registrationStatus ? (
        <div>{registrationStatus}</div>
      ) : (
        <div className="formcontainer">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="formBasicUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="formBasicUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="formBasicEmail" className="form-label">
                Email address
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.email || emailError ? 'is-invalid' : ''
                }`}
                id="formBasicEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
              {emailError && (
                <div className="text-danger">{emailError}</div>
              )}
            </div>
            <div className='mb-3'>
                <label htmlFor='password' className='form-label'>
                Password
                </label>
                <div className='password-input'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${
                    errors.password ? 'is-invalid' : ''
                    }`}
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                />
                <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={handleShowPassword}
                />
                </div>
                {errors.password && (
                <div className='invalid-feedback'>{errors.password}</div>
                )}
            </div>
            <div className='mb-3'>
                <label htmlFor='formBasicConfirmPassword' className='form-label'>
                Confirm Password
                </label>
                <div className='password-input'>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control ${
                    errors.confirmPassword ? 'is-invalid' : ''
                    }`}
                    id='formBasicConfirmPassword'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm Password'
                />
                <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="eye-icon"
                        onClick={handleShowConfirmPassword}
                />
                </div>
                {errors.confirmPassword && (
                <div className='invalid-feedback'>{errors.confirmPassword}</div>
                )}
            </div>
            <button type="submit">
              Submit
            </button>
            <div className="text-center mt-3">
              <p style={{ marginLeft: '10px' }}>
                Already registered?{' '}
                <a href="/login">Go to Login</a>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
