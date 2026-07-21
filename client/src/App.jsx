import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import AuthGateway from './components/AuthGateway';
import Navbar from './components/Navbar';
import Composer from './components/Composer';
import Feed from './components/Feed';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoginView, setIsLoginView] = useState(true);
  const [authError, setAuthError] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUser({ username: localStorage.getItem('username') || 'Operator' });
      fetchFeed();
    } else {
      localStorage.clear();
      setUser(null);
    }
  }, [token]);

  const fetchFeed = async () => {
    try {
      const config = { headers: token ? { Authorization: `Bearer ${token}` } : {} };
      const response = await axios.get('http://localhost:5000/api/posts', config);
      setPosts(response.data);
    } catch (error) {
      console.error("Database connection dropout:", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      if (response.data.success) {
        localStorage.setItem('username', response.data.user.username);
        setToken(response.data.token);
      }
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Registration failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('username', response.data.user.username);
        setToken(response.data.token);
      }
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Credentials rejected.');
    }
  };

  const handleVerifyContent = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:5000/api/posts', { content }, config);
      if (response.data.success) {
        setContent('');
        fetchFeed();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Pipeline barrier broken.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaVerifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('mediaAsset', selectedFile);
      const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      const response = await axios.post('http://localhost:5000/api/media/verify', formData, config);
      if (response.data.success) {
        setSelectedFile(null);
        fetchFeed();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Media failure.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.clear();
  };

  if (!user) {
    return (
      <AuthGateway
        isLoginView={isLoginView} setIsLoginView={setIsLoginView}
        authError={authError} setAuthError={setAuthError}
        username={username} setUsername={setUsername}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        handleLogin={handleLogin} handleSignup={handleSignup}
      />
    );
  }

  return (
    <div className="ws-app-wrapper">
      <Navbar username={user.username} handleLogout={handleLogout} />

      <div className="ws-feed-column">
        <Composer
          username={user.username}
          content={content} setContent={setContent}
          selectedFile={selectedFile} setSelectedFile={setSelectedFile}
          isDragging={isDragging} setIsDragging={setIsDragging}
          isLoading={isLoading}
          handleVerifyContent={handleVerifyContent}
          handleMediaVerifySubmit={handleMediaVerifySubmit}
        />
        <Feed posts={posts} />
      </div>
    </div>
  );
}
