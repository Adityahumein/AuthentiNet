import React from 'react';
import { UploadCloud } from 'lucide-react';
import '../App.css';

export default function Workstation({ 
  content, setContent, selectedFile, setSelectedFile, 
  isDragging, setIsDragging, isLoading, 
  handleVerifyContent, handleMediaVerifySubmit 
}) {
  return (
    <div className="ws-grid-split">
      
      {/* Plain Text Form Panel */}
      <div className="ws-card">
        <form onSubmit={handleVerifyContent} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <span className="ws-form-label">Text Bitstream Input</span>
            <textarea
              value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw string contexts here to check for statistical language generation patterns..."
              className="ws-input-field"
              style={{ height: '176px', resize: 'none', lineHeight: '1.6' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', color: '#64748B', fontSize: '0.7rem' }}>
            <span>Routing: Sapling / RoBERTa</span>
            <button type="submit" disabled={isLoading || !content.trim()} className="ws-btn-primary">
              {isLoading ? 'Processing...' : 'Analyze Sequence'}
            </button>
          </div>
        </form>
      </div>

      {/* Binary Object Dropzone */}
      <div className="ws-card">
        <form onSubmit={handleMediaVerifySubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <span className="ws-form-label">Binary Object Dropzone</span>
            
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('mediaAssetHiddenInput').click()}
              className="ws-dropzone"
              style={{ backgroundColor: isDragging ? 'rgba(56,189,248,0.05)' : '#07090E', border: isDragging ? '2px dashed #38BDF8' : '2px dashed #1E293B' }}
            >
              <input id="mediaAssetHiddenInput" type="file" className="ws-input-field" style={{ display: 'none' }} accept=".pdf,.png,.jpg,.jpeg,.webp,.mp4,.mkv" onChange={(e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); }} />
              <UploadCloud className="w-8 h-8" style={{ color: '#334155', marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace', fontWeight: 'bold', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedFile ? `✓ File Locked: ${selectedFile.name}` : "Drag & Drop target file blocks or click to select"}
              </span>
              <span style={{ fontFamily: 'monospace', color: '#475569', fontSize: '0.6rem', marginTop: '0.25rem' }}>Accepts parameters: PDF, Images, Video</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace', color: '#64748B', fontSize: '0.7rem' }}>
            <span>Routing: Local Hardware Swin Vision</span>
            <button type="submit" disabled={isLoading || !selectedFile} className="ws-btn-primary" style={{ backgroundColor: 'black', color: '#ffffff' }}>
              {isLoading ? 'Streaming...' : 'Deploy Asset Profile'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}