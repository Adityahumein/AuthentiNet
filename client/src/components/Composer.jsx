import React, { useState } from 'react';
import { Image as ImageIcon, X, FileCheck2 } from 'lucide-react';
import '../App.css';

export default function Composer({
  username,
  content, setContent, selectedFile, setSelectedFile,
  isDragging, setIsDragging, isLoading,
  handleVerifyContent, handleMediaVerifySubmit
}) {
  const [mode, setMode] = useState('text'); // 'text' | 'media'
  const initial = (username || '?').charAt(0).toUpperCase();

  const onSubmit = (e) => {
    if (mode === 'text') {
      handleVerifyContent(e);
    } else {
      handleMediaVerifySubmit(e);
    }
  };

  const canSubmit = mode === 'text' ? content.trim().length > 0 : !!selectedFile;

  return (
    <div className="ws-composer">
      <span className="ws-avatar-circle">{initial}</span>

      <form className="ws-composer-body" onSubmit={onSubmit}>
        <div className="ws-composer-mode-row">
          <button type="button" className={`ws-mode-tab ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
            Text
          </button>
          <button type="button" className={`ws-mode-tab ${mode === 'media' ? 'active' : ''}`} onClick={() => setMode('media')}>
            Image / Video / PDF
          </button>
        </div>

        {mode === 'text' ? (
          <textarea
            className="ws-composer-textarea"
            placeholder="What do you want checked for AI authorship?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
        ) : selectedFile ? (
          <div className="ws-composer-chip">
            <FileCheck2 className="w-4 h-4" style={{ color: '#0F9D58', flexShrink: 0 }} />
            <span className="ws-composer-chip-name">{selectedFile.name}</span>
            <button type="button" className="ws-composer-chip-remove" onClick={() => setSelectedFile(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className={`ws-attach-zone ${isDragging ? 'is-dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('mediaAssetHiddenInput').click()}
          >
            <input
              id="mediaAssetHiddenInput" type="file" style={{ display: 'none' }}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.mp4,.mkv"
              onChange={(e) => { if (e.target.files[0]) setSelectedFile(e.target.files[0]); }}
            />
            <ImageIcon className="w-5 h-5" />
            <span className="ws-attach-zone-label">Drop a file, or click to browse</span>
            <span className="ws-attach-zone-sub">PDF · JPG · PNG · WEBP · MP4 · MKV</span>
          </div>
        )}

        <div className="ws-composer-footer">
          <div className="ws-composer-tools">
            <span style={{ fontSize: '0.72rem', color: '#8B98A5' }}>
              {mode === 'text' ? 'Checked by RoBERTa-Large' : 'Checked by Swin Transformer'}
            </span>
          </div>
          <button type="submit" className="ws-post-btn" disabled={isLoading || !canSubmit}>
            {isLoading ? 'Checking…' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
