// frontend/src/App.js

import React, { useEffect, useState } from 'react';
import { fetchWelcomeMessage } from './services/notesServices';
import { BrowserRouter as Routes, Route, Router } from 'react-router-dom';
import NoteList from './components/NoteList'; // List all notes
import NoteForm from './components/NoteForm'; // Form to create a new note
import NoteItem from './components/NoteItem';  // Displays individual note
import NoteEditForm from './components/NoteEditForm'; // Form to edit an existing note

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getMessage = async () => {
      const response = await fetchWelcomeMessage();
      setMessage(response || 'Error fetching data');
    };

    getMessage();
  }, []);

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Smart Notepad</h1>
        </header>
        <main>
          <Routes>
            <Route exact path="/" component={NoteList} />
            <Route path="/create" component={NoteForm} />
            <Route path="/edit/:id" component={NoteEditForm} />   { /*NoteEditForm can also be called as EditNote. */ }
            <Route path="/note/:id" element={NoteItem} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
