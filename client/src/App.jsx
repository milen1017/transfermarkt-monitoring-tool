import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home.jsx";
import AddLeague from "./components/AddLeague.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-league" element={<AddLeague />} />
        <Route path="/api/auth/login" element={<Login />} />
        <Route path="/api/auth/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
