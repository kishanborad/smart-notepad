import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatDistanceToNow } from 'date-fns';

const SmartNoteView = ({ note, onPin, onFavorite }) => {
  const {
    title,
    content,
    category,
    tags,
    format,
    metadata,
    aiMetadata,
    isPinned,
    isFavorite,
    createdAt,
    updatedAt
  } = note;

  // Quill editor modules for read-only mode
  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false
    }
  };

  return (
    <div className={`smart-note ${isPinned ? 'pinned' : ''} ${isFavorite ? 'favorite' : ''}`}>
      <div className="note-header">
        <h2>{title}</h2>
        <div className="note-actions">
          <button
            onClick={() => onPin(note._id)}
            className={`btn btn-icon ${isPinned ? 'active' : ''}`}
            title={isPinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>
          <button
            onClick={() => onFavorite(note._id)}
            className={`btn btn-icon ${isFavorite ? 'active' : ''}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            ⭐
          </button>
        </div>
      </div>

      <div className="note-meta">
        <span className="category">{category}</span>
        <span className="format">{format}</span>
        <span className="date">
          Created {formatDistanceToNow(new Date(createdAt))} ago
        </span>
        {updatedAt !== createdAt && (
          <span className="date">
            Updated {formatDistanceToNow(new Date(updatedAt))} ago
          </span>
        )}
      </div>

      <div className="note-content">
        <ReactQuill
          value={content}
          readOnly={true}
          modules={modules}
          theme="snow"
        />
      </div>

      {tags && tags.length > 0 && (
        <div className="note-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {metadata && (
        <div className="note-stats">
          <div className="stat">
            <span className="label">Words:</span>
            <span className="value">{metadata.wordCount}</span>
          </div>
          <div className="stat">
            <span className="label">Reading time:</span>
            <span className="value">{metadata.readingTime} min</span>
          </div>
          <div className="stat">
            <span className="label">Version:</span>
            <span className="value">{metadata.version}</span>
          </div>
        </div>
      )}

      {aiMetadata && (
        <div className="smart-features">
          {aiMetadata.summary && (
            <div className="summary">
              <h4>Summary</h4>
              <p>{aiMetadata.summary}</p>
            </div>
          )}

          {aiMetadata.keyPoints && aiMetadata.keyPoints.length > 0 && (
            <div className="key-points">
              <h4>Key Points</h4>
              <ul>
                {aiMetadata.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {aiMetadata.sentiment && (
            <div className="sentiment">
              <h4>Sentiment</h4>
              <span className={`sentiment-${aiMetadata.sentiment}`}>
                {aiMetadata.sentiment}
              </span>
            </div>
          )}

          {aiMetadata.autoTags && aiMetadata.autoTags.length > 0 && (
            <div className="auto-tags">
              <h4>Suggested Tags</h4>
              <div className="tags">
                {aiMetadata.autoTags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartNoteView; 