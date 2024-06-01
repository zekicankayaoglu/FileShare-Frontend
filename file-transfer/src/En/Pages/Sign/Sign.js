import React, { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import './Sign.css';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const SignForm = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(`https://localhost:7012/Sign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mail, password, userName: username })
            })
            .then(response => {
                if (response.ok) {
                    console.log('ok');
                    navigate('/en/login-form');
                }
            })
            .catch(error => console.error('Error adding user:', error));
    
  };

  useEffect(() => {
  }, []); 

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>
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
        <button type="submit">Sign Up</button>
        <div className="register-link">
        </div>
      </form>
    </div>
  );
};

export default SignForm;
