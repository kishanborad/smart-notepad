import React from 'react';
import { NoteCategory } from '../types/note';

interface NoteFiltersProps {
  searchQuery: string;
  selectedCategory: NoteCategory | 'all';
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: NoteCategory | 'all') => void;
  onSortChange: (sortBy: 'date' | 'category') => void;
}

const NoteFilters: React.FC<NoteFiltersProps> = ({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="note-filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-controls">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as NoteCategory | 'all')}
          className="category-select"
        >
          <option value="all">All Categories</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="ideas">Ideas</option>
          <option value="tasks">Tasks</option>
          <option value="other">Other</option>
        </select>

        <select
          onChange={(e) => onSortChange(e.target.value as 'date' | 'category')}
          className="sort-select"
        >
          <option value="date">Sort by Date</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>
    </div>
  );
};

export default NoteFilters; 