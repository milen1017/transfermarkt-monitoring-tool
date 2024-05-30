import React from "react";
import { useAuth } from "../context/AuthContext";
import ProtectedLeagues from "./ProtectedLeagues";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h1>Transfermarkt monitoring tool</h1>
      {isAuthenticated ? (
        <ProtectedLeagues />
      ) : (
        <p>Please log in to view and manage transfers.</p>
      )}
    </div>
  );
}

export default Home;
