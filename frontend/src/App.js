import React, { useEffect, useState } from 'react';
import { fetchWelcomeMessage } from './services/notesService';

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
    <div>
      <h1>Smart Notepad</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
