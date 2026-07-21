import React from 'react';
import { ShieldCheck } from 'lucide-react';
import '../App.css';

export default function AuthGateway({
  isLoginView, setIsLoginView, authError, setAuthError,
  username, setUsername, email, setEmail, password, setPassword,
  handleLogin, handleSignup
}) {
  return (
    <div className="ws-auth-shell">
      <div className="ws-auth-brand-panel">
        <div className="ws-auth-brand-mark">
          <ShieldCheck className="w-7 h-7" /> AuthentiNet
        </div>
        <h1 className="ws-auth-brand-headline">
          Post anything. Know what's real.
        </h1>
        <p className="ws-auth-brand-sub">
          A social feed that checks every post — text, images, video, and PDFs — for signs of AI generation before it goes live.
        </p>
      </div>

      <div className="ws-auth-form-panel">
        <div className="ws-auth-form-inner">
          <div className="ws-auth-mobile-brand">
            <ShieldCheck className="w-6 h-6" /> AuthentiNet
          </div>

          <h2 className="ws-auth-title">
            {isLoginView ? 'Sign in' : 'Create your account'}
          </h2>
          <p className="ws-auth-sub">
            {isLoginView ? 'Welcome back. Pick up where you left off.' : 'Join the feed and start posting.'}
          </p>

          {authError && <div className="ws-auth-error">{authError}</div>}

          <form onSubmit={isLoginView ? handleLogin : handleSignup}>
            {!isLoginView && (
              <div className="ws-form-field">
                <label className="ws-form-label">Username</label>
                <input
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  className="ws-input-field" placeholder="jane_doe"
                />
              </div>
            )}
            <div className="ws-form-field">
              <label className="ws-form-label">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="ws-input-field" placeholder="you@example.com"
              />
            </div>
            <div className="ws-form-field">
              <label className="ws-form-label">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="ws-input-field" placeholder="••••••••••••"
              />
            </div>

            <button type="submit" className="ws-auth-submit">
              {isLoginView ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="ws-auth-switch-row">
            {isLoginView ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button className="ws-auth-switch-btn" onClick={() => { setIsLoginView(!isLoginView); setAuthError(''); }}>
              {isLoginView ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
