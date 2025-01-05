// frontend/src/App.js

import React, { useEffect, useState } from 'react';
import { fetchWelcomeMessage } from './services/notesServices'; // Service function to fetch a welcome message
import { Routes, Route } from 'react-router-dom'; // For routing between pages
import NoteList from './components/NoteList'; // Component to display the list of notes
import NoteForm from './components/NoteForm'; // Component for the form to create a new note
import NoteItem from './components/NoteItem'; // Component to display an individual note
import NoteEditForm from './components/NoteEditForm'; // Component for editing an existing note
import './App.css';  // Styles for the app

// Main App component
function App() {
  // State to store the welcome message fetched from the server
  const [message, setMessage] = useState('');

  // useEffect hook to fetch the welcome message on initial render
  useEffect(() => {
    const getMessage = async () => {
      const response = await fetchWelcomeMessage(); // Call the service function
      setMessage(response || 'Error fetching data'); // Set the message state
    };

    getMessage(); // Invoke the function to fetch the message
  }, []); // Empty dependency array means this runs only once after the first render

  return (
    <div className="App">
      <header>
        <h1>Smart Notepad</h1> {/* Header of the app */}
      </header>
      <main>
        {/* Routing for different paths */}
        <Routes>
          {/* Route to display the list of all notes */}
          <Route exact path="/" element={<NoteList />} />
          
          {/* Route to create a new note */}
          <Route path="/create" element={<NoteForm />} />
          
          {/* Route to edit an existing note */}
          <Route path="/edit/:id" element={<NoteEditForm />} />
          
          {/* Another route for editing a note, supporting the ':noteId' param */}
          <Route path="/notes/:noteId/edit" element={<NoteEditForm />} />
          
          {/* Route to display a single note */}
          <Route path="/note/:id" element={<NoteItem />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
