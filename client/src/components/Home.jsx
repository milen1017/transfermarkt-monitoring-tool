import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/leagues');
        setLeagues(response.data);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };

    fetchLeagues();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page.</p>
      <h2>Leagues</h2>
      {leagues.length > 0 ? (
        <ul>
          {leagues.map((league) => (
            <li key={league._id}>
              <strong>{league.leagueName}</strong>: {league.url}
            </li>
          ))}
        </ul>
      ) : (
        <p>No leagues found.</p>
      )}
    </div>
  );
}

export default Home;
