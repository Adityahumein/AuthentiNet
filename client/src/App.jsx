import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';
import './App.css';

import AuthGateway from './components/AuthGateway';
import Sidebar from './components/Sidebar';
import Workstation from './components/Workstation';
import ExplorerLedger from './components/ExplorerLedger';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('workspace');
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
        setActiveTab('ledger');
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
        setActiveTab('ledger');
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} username={user.username} handleLogout={handleLogout} />
      
      <main className="ws-main-content">
        <div className="ws-container-limit" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <header className="ws-header">
            <div>
              <h2 className="ws-header-title">{activeTab} Interface</h2>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>Natively running RoBERTa-Large and Swin Transformer pipelines locally.</p>
            </div>
            <div className="ws-status-badge">
              <Activity style={{ width: '0.85rem', height: '0.85rem', animation: 'pulse 2s infinite' }} /> Adaptive Shield Routing: ARMED
            </div>
          </header>

          {activeTab === 'workspace' ? (
            <Workstation 
              content={content} setContent={setContent}
              selectedFile={selectedFile} setSelectedFile={setSelectedFile}
              isDragging={isDragging} setIsDragging={setIsDragging}
              isLoading={isLoading}
              handleVerifyContent={handleVerifyContent}
              handleMediaVerifySubmit={handleMediaVerifySubmit}
            />
          ) : (
            <ExplorerLedger posts={posts} />
          )}

        </div>
      </main>
    </div>
  );
}