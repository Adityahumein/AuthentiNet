import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import '../App.css';

export default function Navbar({ username, handleLogout }) {
  const initial = (username || '?').charAt(0).toUpperCase();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="ws-navbar">
      <div className="ws-navbar-inner">
        <div className="ws-brand-mark">
          <ShieldCheck className="w-5 h-5" />
          AuthentiNet
        </div>

        <div className="ws-navbar-right">
          <span className="ws-model-pill">
            <span className="ws-model-pill-dot" /> Models online
          </span>

          <div style={{ position: 'relative' }}>
            <button className="ws-avatar-btn" onClick={() => setMenuOpen((v) => !v)}>
              <span className="ws-avatar-circle">{initial}</span>
              <span className="ws-username-text">{username}</span>
            </button>

            {menuOpen && (
              <div
                style={{
                  position: 'absolute', right: 0, top: '110%',
                  background: '#fff', border: '1px solid #EBEEF0', borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(15,20,25,0.12)', minWidth: '160px', overflow: 'hidden', zIndex: 30
                }}
              >
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', border: 'none', padding: '0.7rem 0.9rem',
                    fontSize: '0.85rem', fontWeight: 600, color: '#0F1419', cursor: 'pointer'
                  }}
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
