// src/AddLeague.js
import React, { useState } from 'react';
import axios from 'axios';

function AddLeague() {
  const [url, setUrl] = useState('');
  const [leagueName, setLeagueName] = useState('');
  const [responseData, setResponseData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexPattern = /wettbewerb\/(.*?)(?=\/plus)/;
    const match = url.match(regexPattern);
    if (!match) {
      setError('Invalid URL format');
      return;
    }
    const id = match[1];

    try {
      const response = await axios.post('http://localhost:3000/api/url', {
        url,
        id,
        leagueName,
      });
      setResponseData(response.data);
      setError('');
    } catch (error) {
      console.error('Error submitting URL:', error);
    }
  };

  return (
    <div>
      <h1>Add League</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          placeholder="League Name"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit">Submit</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        {responseData && <div>Response from backend: {responseData}</div>}
      </div>
    </div>
  );
}

export default AddLeague;
