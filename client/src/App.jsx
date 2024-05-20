// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home.jsx";
import AddLeague from "./components/AddLeague.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-league" element={<AddLeague />} />
    </Routes>
  );
}

export default App;
