import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">🏆 Leaderboard</div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
