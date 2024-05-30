import React, { useState } from "react";
import axios from "axios";



const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}api/auth/register`, {
        username,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      // Redirect user or handle registration success
      console.log("Registration successful:", data);
    } catch (error) {
      setError(error.response.data.message);
      console.error("Registration error:", error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
    </div>
  );
};

export default Register;
