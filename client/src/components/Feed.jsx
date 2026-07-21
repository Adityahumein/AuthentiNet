import React from 'react';
import { FileText, Video, Fingerprint, CheckCircle2, AlertCircle } from 'lucide-react';
import '../App.css';

function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${Math.max(seconds, 1)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

export default function Feed({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="ws-empty-feed">
        <p className="ws-empty-feed-title">No posts yet</p>
        <p className="ws-empty-feed-sub">Be the first to post something and find out if it reads as human or AI-made.</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post, index) => {
        const isHuman = post.aiScore?.humanProbability >= 0.5;
        const scoreValue = Math.round((isHuman ? post.aiScore?.humanProbability : post.aiScore?.aiProbability) * 100);
        const isVideo = post.assetMeta?.fileMimeType?.startsWith('video/');
        const isPdf = post.assetMeta?.fileMimeType === 'application/pdf';
        const name = post.userId?.username || 'unknown';
        const initial = name.charAt(0).toUpperCase();
        const shortHash = post.contentHash ? `${post.contentHash.slice(0, 8)}…${post.contentHash.slice(-6)}` : '';

        return (
          <article key={post._id || index} className="ws-post">
            <span className="ws-avatar-circle">{initial}</span>

            <div className="ws-post-main">
              <div className="ws-post-headline">
                <span className="ws-post-name">{name}</span>
                <span className="ws-post-dot">·</span>
                <span className="ws-post-time">{timeAgo(post.createdAt)}</span>
              </div>

              {post.content && (
                <p className="ws-post-text">{post.content}</p>
              )}

              {post.assetMeta?.isMedia && post.assetMeta?.thumbnailRaw ? (
                <div className="ws-post-media">
                  <img src={post.assetMeta.thumbnailRaw} alt="Attached media" />
                </div>
              ) : isVideo ? (
                <div className="ws-post-media">
                  <div className="ws-post-media-placeholder">
                    <Video className="w-6 h-6" style={{ color: '#8B98A5', flexShrink: 0 }} />
                    <div className="ws-post-media-placeholder-text">
                      <span className="ws-post-media-filename">{post.assetMeta?.fileName}</span>
                      <span className="ws-post-media-tag">Video · frame-by-frame check</span>
                    </div>
                  </div>
                </div>
              ) : isPdf ? (
                <div className="ws-post-media">
                  <div className="ws-post-media-placeholder">
                    <FileText className="w-6 h-6" style={{ color: '#8B98A5', flexShrink: 0 }} />
                    <div className="ws-post-media-placeholder-text">
                      <span className="ws-post-media-filename">{post.assetMeta?.fileName}</span>
                      <span className="ws-post-media-tag">PDF · text scanned for AI authorship</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="ws-post-actions">
                <span className={`ws-verdict-tag ${isHuman ? 'ws-verdict-human' : 'ws-verdict-ai'}`}>
                  {isHuman ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {scoreValue}% {isHuman ? 'Human' : 'AI-generated'}
                </span>
                <span className="ws-hash-tag" title={post.contentHash}>
                  <Fingerprint className="w-3.5 h-3.5" /> {shortHash}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
