import React from 'react';
import { Shield, Terminal, Layers, LogOut } from 'lucide-react';
import '../App.css'; 

export default function Sidebar({ activeTab, setActiveTab, username, handleLogout }) {
  return (
    <aside className="ws-sidebar">
      <div>
        <div className="ws-sidebar-brand-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'green' }}>
            <Shield className="w-5 h-5" />
            <span style={{ fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'black', fontSize: '0.8rem' }}>AuthentiNet</span>
          </div>
          <span style={{ fontFamily: 'monospace', color: '#64748B', fontSize: '0.6rem', padding: '0.15rem 0.4rem', backgroundColor: '#07090E',  borderRadius: '4px' }}>PROD_v1</span>
        </div>

        <nav className="ws-nav-menu">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`ws-nav-link ${activeTab === 'workspace' ? 'ws-active-tab' : ''}`}
          >
            <Terminal className="w-4 h-4" /> LOCAL_WORKSTATION
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`ws-nav-link ${activeTab === 'ledger' ? 'ws-active-tab' : ''}`}
          >
            <Layers className="w-4 h-4" /> EXPLORER_LEDGER
          </button>
        </nav>
      </div>

      <div style={{ padding: '1rem',  backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'monospace', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ color: '#64748B', fontWeight: 'bold', fontSize: '0.6rem' }}>OPERATOR_NODE_SIGNATURE:</span>
          <span style={{ color: '#ED94E2', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.25rem' }}>↳ {username}</span>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', color: '#F87171', padding: '0.4rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <LogOut className="w-3.5 h-3.5" /> disconnect_session
        </button>
      </div>
    </aside>
  );
}