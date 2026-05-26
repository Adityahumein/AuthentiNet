import React from 'react';
import { Shield } from 'lucide-react';
import '../App.css';

export default function AuthGateway({ 
  isLoginView, setIsLoginView, authError, setAuthError,
  username, setUsername, email, setEmail, password, setPassword,
  handleLogin, handleSignup 
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="ws-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(200, 247, 151, 0.6)', color: 'green', marginBottom: '1rem' }}>
            <Shield className="w-6 h-6" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '0.25rem' }}>
            {isLoginView ? 'Workstation Authentication' : 'Provision New System Node'}
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            {isLoginView ? 'Connect credentials to sync local analysis configurations.' : 'Set up parameters to authorize new network file interactions.'}
          </p>
        </div>

        {authError && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)',  color: '#EF4444', fontSize: '0.75rem', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', marginBottom: '1rem' }}>
            [CRITICAL_AUTH_FAIL]: {authError}
          </div>
        )}

        <form onSubmit={isLoginView ? handleLogin : handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLoginView && (
            <div>
              <label className="ws-form-label">Operator Alias</label>
              <input
                type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                className="ws-input-field" placeholder="operator_alpha"
              />
            </div>
          )}
          <div>
            <label className="ws-form-label">Secure Email Core</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="ws-input-field" placeholder="name@node.internal"
            />
          </div>
          <div>
            <label className="ws-form-label">Authorization Token Key</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="ws-input-field" placeholder="••••••••••••"
            />
          </div>

          <button type="submit" className="ws-btn-primary" style={{ borderRadius: '50px', padding: '0.75rem', marginTop: '0.5rem', width: '100%' }}>
            {isLoginView ? 'Initialize Node Connection' : 'Register Secure Signature Pool'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem' }}>
          <button onClick={() => { setIsLoginView(!isLoginView); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'green', fontSize: '0.75rem', cursor: 'pointer' }}>
            {isLoginView ? "Need a verified profile registry? Build node" : 'Existing operational identity found? Authenticate'}
          </button>
        </div>
      </div>
    </div>
  );
}