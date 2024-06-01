import React, { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import './Login.css';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch('https://localhost:7012/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mail, password }),
    });
    console.log(response);
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      const userID = responseData;
      localStorage.setItem('user', userID);
      console.log(userID);
      console.log('Login successful.');
      navigate('/upload');
    } else {
      console.error('Login failed');
    }
    } catch (error) {
        console.error('Failed to fetch', error);
    }
    
  };

  useEffect(() => {
  }, []); 

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <div className="register-link">
          <NavLink to="/en/sign-form">Create Account</NavLink>
        </div>
        <button type="submit">Login</button>
        
        
      </form>
    </div>
  );
};

export default LoginForm;
