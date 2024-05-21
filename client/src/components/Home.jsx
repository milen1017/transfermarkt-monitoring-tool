import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState({});
  const [showChecked, setShowChecked] = useState(false);

  const fetchLeagues = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/leagues');
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleScrapeAndSave = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/scrape-transfers');
      fetchLeagues(); // Re-fetch leagues to update the data
    } catch (error) {
      console.error('Error during scraping and saving transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransfers = async (leagueID) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/transfers/${leagueID}`);
      setTransfers((prevTransfers) => ({ ...prevTransfers, [leagueID]: response.data }));
    } catch (error) {
      console.error(`Error fetching transfers for league ${leagueID}:`, error);
    }
  };

  const handleCheckTransfer = async (transferID, checked) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/transfers/${transferID}`, { checked });
      const updatedTransfer = response.data;

      setTransfers((prevTransfers) => {
        const leagueID = updatedTransfer.leagueID;
        const updatedTransfers = prevTransfers[leagueID].map((transfer) =>
          transfer._id === transferID ? updatedTransfer : transfer
        );
        return { ...prevTransfers, [leagueID]: updatedTransfers };
      });
    } catch (error) {
      console.error('Error updating transfer:', error);
    }
  };

  const toggleShowChecked = () => {
    setShowChecked(!showChecked);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page.</p>
      <button onClick={handleScrapeAndSave} disabled={loading}>
        {loading ? 'Processing...' : 'Scrape and Save Transfers'}
      </button>
      <h2>Leagues</h2>
      {leagues.length > 0 ? (
        <ul>
          {leagues.map((league) => (
            <li key={league._id}>
              <strong>{league.leagueName}</strong> id: {league.id} : <a href={league.url}>link</a>
              <button onClick={() => fetchTransfers(league.id)}>Show Transfers</button>
              <h3>Transfers:</h3>
              <button onClick={toggleShowChecked}>
                {showChecked ? 'Hide Checked Transfers' : 'Show Checked Transfers'}
              </button>
              {transfers[league.id] ? (
                transfers[league.id].length > 0 ? (
                  <ul>
                    {transfers[league.id]
                      .filter((transfer) => !transfer.checked || showChecked)
                      .map((transfer) => (
                        <li key={transfer._id}>
                          <strong>{transfer.name}</strong> - {transfer.position}
                          <br />
                          From: {transfer.fromTeam} To: {transfer.toTeam}
                          <br />
                          Date: {new Date(transfer.date).toLocaleDateString()}
                          <br />
                          <label>
                            <input
                              type="checkbox"
                              checked={transfer.checked}
                              onChange={(e) => handleCheckTransfer(transfer._id, e.target.checked)}
                            />
                            Checked
                          </label>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p>No transfers found for this league.</p>
                )
              ) : (
                <p>Click "Show Transfers" to load transfers.</p>
              )}
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
