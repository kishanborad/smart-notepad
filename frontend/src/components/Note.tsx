import React, { useState } from 'react';
import { Note as NoteType, NoteCategory } from '../types/note';
import ColorPicker from './ColorPicker';

interface NoteProps {
  note: NoteType;
  onUpdate: (id: string, updates: Partial<NoteType>) => void;
  onDelete: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState<NoteCategory>(note.category);
  const [tags, setTags] = useState<string>(note.tags.join(', '));
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSave = () => {
    onUpdate(note.id, {
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      updatedAt: new Date(),
    });
    setIsEditing(false);
  };

  const handlePinToggle = () => {
    onUpdate(note.id, { isPinned: !note.isPinned });
  };

  const handleColorChange = (color: string) => {
    onUpdate(note.id, { color });
    setShowColorPicker(false);
  };

  return (
    <div 
      className={`note-card ${note.isPinned ? 'pinned' : ''}`} 
      style={{ backgroundColor: note.color || '#ffffff' }}
    >
      {isEditing ? (
        <div className="note-edit">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="note-textarea"
            placeholder="Write your note here..."
          />
          <div className="note-meta">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="category-select"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="ideas">Ideas</option>
              <option value="tasks">Tasks</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="tags-input"
            />
            <div className="color-picker-container">
              <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="btn-color"
                style={{ backgroundColor: note.color || '#ffffff' }}
              >
                🎨
              </button>
              {showColorPicker && (
                <ColorPicker
                  selectedColor={note.color || '#ffffff'}
                  onColorChange={handleColorChange}
                />
              )}
            </div>
          </div>
          <div className="note-actions">
            <button onClick={handleSave} className="btn-save">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="note-view">
          <div className="note-header">
            <span className="note-category">{note.category}</span>
            <div className="note-header-actions">
              <button onClick={handlePinToggle} className="btn-pin">
                {note.isPinned ? '📌' : '📍'}
              </button>
              <button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="btn-color"
                style={{ backgroundColor: note.color || '#ffffff' }}
              >
                🎨
              </button>
            </div>
          </div>
          {showColorPicker && (
            <ColorPicker
              selectedColor={note.color || '#ffffff'}
              onColorChange={handleColorChange}
            />
          )}
          <p className="note-content">{note.content}</p>
          {note.tags.length > 0 && (
            <div className="note-tags">
              {note.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="note-actions">
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              Edit
            </button>
            <button onClick={() => onDelete(note.id)} className="btn-delete">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note; 