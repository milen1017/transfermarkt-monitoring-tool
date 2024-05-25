import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState({});
  const [showCheckedTransfers, setShowCheckedTransfers] = useState({});
  const [showUncheckedTransfers, setShowUncheckedTransfers] = useState({});

  const fetchLeagues = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/leagues");
      setLeagues(response.data);
    } catch (error) {
      console.error("Error fetching leagues:", error);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (leagues.length > 0) {
      leagues.forEach((league) => {
        fetchTransfers(league.id);
      });
    }
  }, [leagues]);

  const handleScrapeAndSave = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/scrape-transfers");
      fetchLeagues(); // Re-fetch leagues to update the data
    } catch (error) {
      console.error("Error during scraping and saving transfers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransfers = async (leagueID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/transfers/${leagueID}`
      );
      setTransfers((prevTransfers) => ({
        ...prevTransfers,
        [leagueID]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching transfers for league ${leagueID}:`, error);
    }
  };

  const handleCheckTransfer = async (transferID, checked) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/transfers/${transferID}`,
        { checked }
      );
      const updatedTransfer = response.data;

      setTransfers((prevTransfers) => {
        const leagueID = updatedTransfer.leagueID;
        const updatedTransfers = prevTransfers[leagueID].map((transfer) =>
          transfer._id === transferID ? updatedTransfer : transfer
        );
        return { ...prevTransfers, [leagueID]: updatedTransfers };
      });
    } catch (error) {
      console.error("Error updating transfer:", error);
    }
  };

  const toggleShowCheckedTransfers = (leagueID) => {
    setShowCheckedTransfers((prevState) => ({
      ...prevState,
      [leagueID]: !prevState[leagueID],
    }));
  };

  const toggleShowUncheckedTransfers = (leagueID) => {
    setShowUncheckedTransfers((prevState) => ({
      ...prevState,
      [leagueID]: !prevState[leagueID],
    }));
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page.</p>
      <button onClick={handleScrapeAndSave} disabled={loading}>
        {loading ? "Processing..." : "Scrape and Save Transfers"}
      </button>
      <h2>Leagues</h2>
      {leagues.length > 0 ? (
        <ul>
          {leagues.map((league) => (
            <li key={league._id}>
              <a href={league.url} target="_blank" rel="noopener noreferrer">
                {league.leagueName}
              </a>{" "}
              id: {league.id}
              <button onClick={() => toggleShowUncheckedTransfers(league.id)}>
                {showUncheckedTransfers[league.id]
                  ? "Hide Unchecked Transfers"
                  : "Show Unchecked Transfers"}
              </button>
              <button onClick={() => toggleShowCheckedTransfers(league.id)}>
                {showCheckedTransfers[league.id]
                  ? "Hide Checked Transfers"
                  : "Show Checked Transfers"}
              </button>
              {transfers[league.id] && (
                <div>
                  {showUncheckedTransfers[league.id] && (
                    <div>
                      <h3>Unchecked Transfers</h3>
                      <ul>
                        {transfers[league.id]
                          .filter((transfer) => !transfer.checked)
                          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newer to older
                          .map((transfer) => (
                            <li key={transfer._id}>
                              <strong>{transfer.name}</strong> -{" "}
                              {transfer.position}
                              <br />
                              From: {transfer.fromTeam} To: {transfer.toTeam}
                              <br />
                              Date:{" "}
                              {new Date(transfer.date).toLocaleDateString()}
                              <br />
                              <label>
                                <input
                                  type="checkbox"
                                  checked={transfer.checked}
                                  onChange={(e) =>
                                    handleCheckTransfer(
                                      transfer._id,
                                      e.target.checked
                                    )
                                  }
                                />
                                Checked
                              </label>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {showCheckedTransfers[league.id] && (
                    <div>
                      <h3>Checked Transfers</h3>
                      <ul>
                        {transfers[league.id]
                          .filter((transfer) => transfer.checked)
                          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newer to older
                          .map((transfer) => (
                            <li key={transfer._id}>
                              <strong>{transfer.name}</strong> -{" "}
                              {transfer.position}
                              <br />
                              From: {transfer.fromTeam} To: {transfer.toTeam}
                              <br />
                              Date:{" "}
                              {new Date(transfer.date).toLocaleDateString()}
                              <br />
                              <label>
                                <input
                                  type="checkbox"
                                  checked={transfer.checked}
                                  onChange={(e) =>
                                    handleCheckTransfer(
                                      transfer._id,
                                      e.target.checked
                                    )
                                  }
                                />
                                Checked
                              </label>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
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
