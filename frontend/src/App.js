
import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Failed to fetch from backend"));
  }, []);

  return (
    <div className="App">
      <h1>Diagramator Interactive</h1>
      <p>Frontend is running.</p>
      <p>Backend says: <strong>{message}</strong></p>
    </div>
  );
}

export default App;
