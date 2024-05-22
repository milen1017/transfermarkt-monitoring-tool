import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home.jsx";
import AddLeague from "./components/AddLeague.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-league" element={<AddLeague />} />
      </Routes>
    </div>
  );
}

export default App;
