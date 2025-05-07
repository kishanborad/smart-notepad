// NoteForm.js

import React, { useState, useEffect, useRef } from 'react';
import { createNote } from '../Api'; // API utility for creating notes
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { debounce } from 'lodash';

const NoteForm = ({ onAddNote }) => {
  // State for handling form input
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Text'); // Default category
  const [tags, setTags] = useState(''); // Tags will be a comma-separated string
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [format, setFormat] = useState('plain');
  const [suggestions, setSuggestions] = useState([]);
  const [spellingErrors, setSpellingErrors] = useState([]);
  const [grammarIssues, setGrammarIssues] = useState([]);
  const [writingSuggestions, setWritingSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const quillRef = useRef(null);

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
    keyboard: {
      bindings: {
        tab: {
          key: 9,
          handler: function() {
            if (suggestions.length > 0) {
              const firstSuggestion = suggestions[0].text;
              const range = this.quill.getSelection();
              if (range) {
                this.quill.deleteText(range.index - 1, 1);
                this.quill.insertText(range.index - 1, firstSuggestion + ' ');
              }
              setShowSuggestions(false);
              return false;
            }
            return true;
          }
        }
      }
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image', 'code-block'
  ];

  // Debounced content analysis
  const analyzeContent = debounce(async (text) => {
    if (!text) return;
    
    setIsAnalyzing(true);
    try {
      // Get autocomplete suggestions
      const response = await fetch('/api/notes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setSpellingErrors(data.spellingErrors || []);
      setGrammarIssues(data.grammarIssues || []);
      setWritingSuggestions(data.writingSuggestions || []);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, 500);

  // Handle content changes with enhanced analysis
  const handleContentChange = (value, delta, source, editor) => {
    setContent(value);
    
    if (source === 'user') {
      const range = editor.getSelection();
      if (range) {
        const [leaf] = editor.getLeaf(range.index);
        const text = leaf.text;
        const rect = editor.getBounds(range.index);
        
        if (rect) {
          setSuggestionPosition({
            top: rect.top + 20,
            left: rect.left
          });
        }
        
        analyzeContent(text);
      }
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        quillRef.current.deleteText(range.index - 1, 1);
        quillRef.current.insertText(range.index - 1, suggestion + ' ');
      }
    }
    setShowSuggestions(false);
  };

  // Render spelling and grammar suggestions
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <div 
        className="suggestions-popup"
        style={{
          position: 'absolute',
          top: suggestionPosition.top,
          left: suggestionPosition.left,
          zIndex: 1000
        }}
      >
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-item"
            onClick={() => handleSuggestionSelect(suggestion.text)}
          >
            {suggestion.text}
            <span className="suggestion-score">{suggestion.score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render spelling and grammar issues
  const renderIssues = () => {
    if (spellingErrors.length === 0 && grammarIssues.length === 0) return null;

    return (
      <div className="issues-panel">
        {spellingErrors.length > 0 && (
          <div className="spelling-errors">
            <h4>Spelling Suggestions</h4>
            {spellingErrors.map((error, index) => (
              <div key={index} className="error-item">
                <span className="error-word">{error.word}</span>
                <div className="suggestions">
                  {error.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      className="suggestion-btn"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div className="context">{error.context}</div>
              </div>
            ))}
          </div>
        )}

        {grammarIssues.length > 0 && (
          <div className="grammar-issues">
            <h4>Grammar Suggestions</h4>
            {grammarIssues.map((issue, index) => (
              <div key={index} className="issue-item">
                <span className="issue-type">{issue.type}</span>
                <div className="issue-text">{issue.text}</div>
                <div className="suggestion">{issue.suggestion}</div>
              </div>
            ))}
          </div>
        )}

        {writingSuggestions.length > 0 && (
          <div className="writing-suggestions">
            <h4>Writing Suggestions</h4>
            {writingSuggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <h5>{suggestion.type}</h5>
                {suggestion.suggestions && (
                  <ul>
                    {suggestion.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
                {suggestion.analysis && (
                  <div className="analysis">
                    {Object.entries(suggestion.analysis).map(([key, value]) => (
                      <div key={key} className="analysis-item">
                        <span className="label">{key}:</span>
                        <span className="value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for title and content
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    try {
      // Convert tags string to an array and combine with suggested tags
      const manualTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const allTags = [...new Set([...manualTags, ...suggestedTags])];

      // Create the note object
      const newNote = {
        title,
        content,
        is_Deleted: false,
        category,
        tags: allTags,
        format,
      };

      // Send new note data to the backend
      const createdNote = await createNote(newNote);

      // Add the newly created note to the parent component
      onAddNote(createdNote);

      // Reset form
      setTitle('');
      setContent('');
      setCategory('Text'); // Reset to default category
      setTags(''); // Reset tags
      setError('');
      setSuggestedTags([]);
      setFormat('plain');
    } catch (error) {
      setError('Error creating note');
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="note-form">
      <h3>Add New Note</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <div className="editor-container">
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Enter note content"
              className="quill-editor"
            />
            {renderSuggestions()}
          </div>
        </div>

        {renderIssues()}

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
          >
            <option value="Text">Text</option>
            <option value="To-Do List">To-Do List</option>
            <option value="Meeting Notes">Meeting Notes</option>
            <option value="Idea">Idea</option>
            <option value="Code Snippets">Code Snippets</option>
            <option value="Checklist">Checklist</option>
            <option value="Sketch">Sketch</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="format">Format:</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="form-control"
          >
            <option value="plain">Plain Text</option>
            <option value="rich">Rich Text</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated):</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (e.g., Work, Personal)"
            className="form-control"
          />
          {suggestedTags.length > 0 && (
            <div className="suggested-tags">
              <small>Suggested tags: {suggestedTags.join(', ')}</small>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Add Note'}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
