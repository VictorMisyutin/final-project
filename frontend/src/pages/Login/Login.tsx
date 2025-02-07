import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import config from '../../config';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(config.backendUrl + '/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',  // Skip the Ngrok warning page
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('userId', data.data.user.id); 
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="page-container">
      <h1 className="website-title">Tourney Tally</h1>
      <div className="login-container">
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="submit"
          value={loading ? 'Logging In...' : 'Log In'}
          onClick={handleLogin}
          disabled={loading}
        />
        {error && <p className="error-message">{error}</p>}
        <Link to="/register">
          <input type="submit" value="Sign Up" />
        </Link>
      </div>
    </div>
  );
};

export default Login;
