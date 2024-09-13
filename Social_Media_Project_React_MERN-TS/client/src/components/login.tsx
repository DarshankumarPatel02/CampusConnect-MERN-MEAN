import { useState, FormEvent } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../Logo.png';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (!email.match(emailRegex)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log(email);
      axios
        .post('http://localhost:3200/api/user/login', {
          email,
          password,
        })
        .then((res) => {
          console.log(res);
          localStorage.setItem('token', res?.data?.token);
          navigate('/post');
        })
        .catch((err) => {
          console.log(err);
          if (err?.response?.status === 404) {
            setErrors({ email: 'Email is not registered' });
          } else if (err?.response?.status === 401) {
            setErrors({ password: 'Wrong password' });
          } else {
            alert(err?.response?.data?.message);
          }
        });
    }
  };

  return (
    <>
    <div className='vishesh'>
    <img src={logo} alt="Logo" />
    <h4>Humber's own Social Media </h4>
      <h2>Login</h2>
      <hr />
      <div className='formcontainer'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email address
            </label> 
            <input
              type='text'
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter email'
            />
            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
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
            {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
          </div>
          <button type='submit'>
            Submit
          </button>
          <div>
          <div className="text-center mt-3">
              <p style={{ marginLeft: '10px' }}>
                Not Register Yet?{' '}
                <a href="/register">Register Here</a>
              </p>
            </div>
            <div className="text-center mt-3">
                <a href="/admin">ADMIN PANEL</a>
            </div>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default Login;
