import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/services/api";
import { saveTokenWithRole } from "@/services/auth";
import "./LoginPage.css";
import { connectSocket } from "@/socket/websocket";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { username, password });
  
      const token = res.data.access_token;
      const role = res.data.role;
      const user = res.data.user;
      // Save token and role
      saveTokenWithRole(token, role, user);
    
      // Connect to socket
      connectSocket(token);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-leaderboard");
      } else {
        navigate("/leaderboard");
      }
    } catch (e) {
      setError("Login failed. Please check credentials.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(); 
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.8 }}  
    >
        <div className="login-container">
        <div className="login-box">
            <form onSubmit={handleSubmit}>
            
                <h1>Leaderboard</h1>
                <h4>Login to your account</h4>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
        </div>
    </motion.div>
  );
};

export default LoginPage;
