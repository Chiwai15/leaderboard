import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import AdminLeaderboardPage from "./pages/AdminLeaderboardPage/AdminLeaderboardPage";
import UserLeaderboardPage from "./pages/UserLeaderboardPage/UserLeaderboardPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { getToken } from "./services/auth";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <>
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-leaderboard" element={<AdminLeaderboardPage />} />
        <Route path="/leaderboard" element={<UserLeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={1000} limit={2} />
    </>
  );
};

export default App;