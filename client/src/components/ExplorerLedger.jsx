import React from 'react';
import { FileText, Image as ImageIcon, Video, Clipboard, CheckCircle, AlertTriangle } from 'lucide-react';
import '../App.css';

export default function ExplorerLedger({ posts }) {
  return (
    <div className="ws-ledger-stack">
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', borderRadius: '8px', backgroundColor: 'rgba(15,19,26,0.5)' }}>
          <p style={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'monospace', margin: 0 }}>No telemetry documents recorded in database cluster files.</p>
        </div>
      ) : (
        posts.map((post, index) => {
          const isHuman = post.aiScore?.humanProbability >= 0.5;
          const scoreValue = Math.round((isHuman ? post.aiScore?.humanProbability : post.aiScore?.aiProbability) * 100);
          const isVideo = post.assetMeta?.fileMimeType?.startsWith('video/');

          return (
            <div key={post._id || index} className="ws-card" style={{ padding: 0, overflow: 'hidden' }}>
              
              {/* Card Meta Header Block */}
              <div className="ws-ledger-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontFamily: 'monospace',  color: '#ED94E2', backgroundColor: 'rgba(0,0,0,0.1)', width: '32px', height: '32px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ID
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Node: {post.userId?.username || 'root_operator'}</span>
                    <span style={{ color: '#64748B', fontSize: '0.6rem', marginTop: '0.1rem' }}>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Metric Verification Badge */}
                <span className={`ws-pill-badge ${isHuman ? 'ws-badge-human' : 'ws-badge-ai'}`}>
                  {isHuman ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {scoreValue}% {isHuman ? 'Human Asset' : 'AI Generated'}
                </span>
              </div>

              {/* CENTER STAGE: Multi-Media Structural Framework */}
              {post.assetMeta?.isMedia && post.assetMeta?.thumbnailRaw ? (
                <div className="ws-media-frame">
                  <img src={post.assetMeta.thumbnailRaw} alt="Forensic framework analysis" style={{ maxWidth: '100%', maxHeight: '360px', objectFit: 'contain', borderRadius: '4px' }} />
                </div>
              ) : isVideo ? (
                <div className="ws-media-frame" style={{ fontFamily: 'monospace', color: '#64748B', gap: '0.4rem', height: '192px' }}>
                  <Video style={{ width: '2rem', height: '2rem', color: '#1E293B' }} />
                  <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%', padding: '0 1rem' }}>{post.assetMeta?.fileName}</span>
                  <span style={{ fontSize: '0.6rem' }}>[Video Stream Sequence Parsed Across Frames]</span>
                </div>
              ) : post.assetMeta?.fileMimeType === 'application/pdf' ? (
                <div className="ws-media-frame" style={{ fontFamily: 'monospace', gap: '0.4rem', height: '160px',  alignItems: 'center' }}>
                  <FileText style={{ width: '2rem', height: '2rem', color: '#1E293B' }} />
                  <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%', padding: '0 1rem' }}>{post.assetMeta?.fileName}</span>
                  <span style={{ color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.6rem' }}>RoBERTa Slidewindow Matrix Summary</span>
                </div>
              ) : null}

              {/* Data Text Layout Content summaries */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#f3f3f3',  color: '#94A3B8', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  <span style={{ color: '#64748B', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem', fontSize: '0.6rem', textTransform: 'uppercase' }}>[EXTRACTED_SUMMARY_TELEMETRY]:</span>
                  {post.content || "No structural text declared in asset profile scope parameters."}
                </div>

                <div style={{ backgroundColor: 'rgba(0,0,0,0.1)',  borderRadius: '6px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'between', fontFamily: 'monospace', fontSize: '0.6rem' }}>
                  <span style={{ color: '#64748B', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clipboard style={{ width: '0.85rem', height: '0.85rem' }} /> SHA-256 BLOCK_HASH:
                  </span>
                  <span style={{ color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{post.contentHash}</span>
                </div>
              </div>

            </div>
          );
        })
      )}
    </div>
  );
}