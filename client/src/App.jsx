import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('workspace');
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUser({ username: localStorage.getItem('username') || 'Verified Node' });
      fetchFeed();
    } else {
      localStorage.clear();
      setUser(null);
    }
  }, [token]);

  const fetchFeed = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Database sync dropout:", error);
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
      alert(error.response?.data?.error || "Pipeline connection broken.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.clear();
  };

  // MONOCHROME GATE: Authentication Interface
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col justify-center items-center p-6 antialiased">
        <div className="w-full max-w-sm bg-[#111111] border border-[#262626] p-8 rounded-lg shadow-xl animate-ease-in">
          
          <div className="space-y-1 mb-6">
            <h1 className="text-lg font-bold text-white tracking-tight">
              {isLoginView ? 'Sign in to AuthentiNet' : 'Create an account'}
            </h1>
            <p className="text-xs text-[#a3a3a3]">
              {isLoginView ? 'Enter your details to open your workstation node.' : 'Set up credentials to register cryptographic origins.'}
            </p>
          </div>

          {authError && (
            <div className="bg-[#1a1111] border border-[#451a1a] text-[#f87171] text-xs py-2 px-3 rounded mb-4 font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={isLoginView ? handleLogin : handleSignup} className="space-y-4">
            {!isLoginView && (
              <div>
                <label className="text-[11px] font-mono tracking-wider uppercase text-[#737373] block mb-1">Username</label>
                <input
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#171717] border border-[#262626] text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-[#404040] font-mono"
                  placeholder="aditya_alpha"
                />
              </div>
            )}
            <div>
              <label className="text-[11px] font-mono tracking-wider uppercase text-[#737373] block mb-1">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#171717] border border-[#262626] text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-[#404040] font-mono"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono tracking-wider uppercase text-[#737373] block mb-1">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#171717] border border-[#262626] text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-[#404040] font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <button type="submit" className="w-full bg-[#ededed] hover:bg-white text-black font-semibold py-2 rounded text-xs transition duration-150 mt-2">
              {isLoginView ? 'Continue' : 'Create profile'}
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t border-[#262626]">
            <button onClick={() => { setIsLoginView(!isLoginView); setAuthError(''); }} className="text-xs text-[#a3a3a3] hover:text-white transition">
              {isLoginView ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ULTRA-CLEAN DEV DASHBOARD RENDER
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col md:flex-row antialiased">
      
      {/* MONOCHROME LEFT SIDEBAR */}
      <aside className="w-full md:w-60 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-[#262626] flex flex-col justify-between sticky top-0 z-40">
        <div>
          {/* Minimalist Top App ID */}
          <div className="h-14 flex items-center px-6 border-b border-[#262626] justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-white">AuthentiNet</span>
            <span className="text-[9px] font-mono bg-[#171717] text-[#a3a3a3] border border-[#262626] px-1.5 py-0.5 rounded">v1.0.0</span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition ${
                activeTab === 'workspace' ? 'bg-[#171717] text-white font-bold' : 'text-[#a3a3a3] hover:text-[#ededed] hover:bg-[#111111]'
              }`}
            >
              Terminal
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition ${
                activeTab === 'ledger' ? 'bg-[#171717] text-white font-bold' : 'text-[#a3a3a3] hover:text-[#ededed] hover:bg-[#111111]'
              }`}
            >
              Global Explorer
            </button>
          </nav>
        </div>

        {/* User Identity Box */}
        <div className="p-4 border-t border-[#262626] bg-[#0d0d0d] space-y-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider">Operator ID</span>
            <span className="text-xs font-semibold text-white truncate font-mono">{user.username}</span>
          </div>
          <button onClick={handleLogout} className="w-full text-center text-[#a3a3a3] hover:text-[#f87171] border border-[#262626] hover:border-[#451a1a] bg-transparent py-1.5 rounded text-[10px] font-mono transition">
            disconnect_session
          </button>
        </div>
      </aside>

      {/* DYNAMIC CONTENT TERMINAL BLOCK */}
      <main className="flex-1 bg-[#0a0a0a] p-6 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          
          {/* Analysis View */}
          {activeTab === 'workspace' && (
            <div className="space-y-6 animate-ease-in">
              <div className="border-b border-[#262626] pb-3">
                <h2 className="text-md font-bold text-white tracking-tight">Workstation Terminal</h2>
                <p className="text-xs text-[#a3a3a3] mt-0.5">Submit copy arrays to calculate SHA-256 fingerprint chains and text processing metrics.</p>
              </div>

              <div className="bg-[#111111] border border-[#262626] rounded p-4">
                <form onSubmit={handleVerifyContent} className="space-y-4">
                  <textarea
                    value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste layout text here to test integrity metrics across microservices..."
                    className="w-full h-44 bg-[#0a0a0a] border border-[#262626] rounded p-3 text-xs font-mono text-[#ededed] placeholder-[#525252] focus:outline-none focus:border-[#404040] transition leading-relaxed resize-none"
                  />
                  <div className="flex justify-between items-center text-[11px] font-mono text-[#737373]">
                    <span>Standard I/O waiting</span>
                    <button
                      type="submit" disabled={isLoading || !content.trim()}
                      className="bg-white hover:bg-[#e5e5e5] disabled:bg-[#171717] disabled:text-[#525252] text-black text-xs font-semibold px-4 py-1.5 rounded transition"
                    >
                      {isLoading ? 'Processing Pipeline...' : 'Run Analysis'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Ledger Explorer View */}
          {activeTab === 'ledger' && (
            <div className="space-y-6 animate-ease-in">
              <div className="border-b border-[#262626] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-md font-bold text-white tracking-tight">Global Explorer Feed</h2>
                  <p className="text-xs text-[#a3a3a3] mt-0.5">Public matrix directory showing checked data origins across local clusters.</p>
                </div>
                <span className="text-[10px] font-mono bg-[#171717] text-white border border-[#262626] px-2 py-0.5 rounded">
                  Documents: {posts.length}
                </span>
              </div>

              <div className="space-y-3">
                {posts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#262626] rounded">
                    <p className="text-[#525252] text-xs font-mono">No files processed in current tracking lifecycle.</p>
                  </div>
                ) : (
                  posts.map((post, index) => {
                    const isHuman = post.aiScore?.humanProbability >= 0.5;
                    const confidenceValue = Math.round((isHuman ? post.aiScore?.humanProbability : post.aiScore?.aiProbability) * 100);

                    return (
                      <div key={post._id || index} className="bg-[#111111] border border-[#262626] rounded p-4 space-y-3 border-premium-hover transition duration-150">
                        
                        {/* Item Bar Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-[#262626]">
                          <div className="flex items-center space-x-2 font-mono">
                            <span className="text-[#a3a3a3]">NODE:</span>
                            <span className="text-white font-bold">{post.userId?.username || 'root_system'}</span>
                            <span className="text-[#525252] font-normal">|</span>
                            <span className="text-[#737373] text-[10px]">{new Date(post.createdAt).toLocaleTimeString()}</span>
                          </div>

                          <div className="flex items-center space-x-1.5 font-mono text-[10px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${isHuman ? 'bg-white' : 'bg-neutral-500'}`}></span>
                            <span className="text-white font-semibold">
                              {confidenceValue}% {isHuman ? 'Human Asset' : 'AI Generated'}
                            </span>
                          </div>
                        </div>

                        {/* Stamped Content Area */}
                        <p className="text-[#d4d4d4] text-xs font-mono leading-relaxed bg-[#0a0a0a] p-3 rounded border border-[#1f1f1f] whitespace-pre-wrap">
                          {post.content}
                        </p>

                        {/* System Metadata Tracking Block */}
                        <div className="bg-[#0d0d0d] rounded border border-[#1f1f1f] p-3 space-y-2 text-[10px] font-mono">
                          
                          {/* Minimal Progress Bar Metric */}
                          <div className="flex items-center space-x-3">
                            <span className="text-[#737373] w-24 shrink-0 uppercase tracking-tight">Confidence Range:</span>
                            <div className="w-full bg-[#171717] h-1 rounded overflow-hidden">
                              <div 
                                className="h-full bg-white transition-all duration-300"
                                style={{ width: `${confidenceValue}%` }}
                              ></div>
                            </div>
                            <span className="text-white font-bold shrink-0">{confidenceValue}%</span>
                          </div>

                          {/* Raw Forensic Hashing Trace */}
                          <div className="flex items-center justify-between pt-1 border-t border-[#171717]">
                            <span className="text-[#737373] uppercase tracking-tight">SHA-256 Checksum:</span>
                            <span className="text-white font-semibold select-all truncate max-w-[70%] text-right lowercase">
                              {post.contentHash}
                            </span>
                          </div>

                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}