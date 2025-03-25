import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { getToken, getUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import "./UserLeaderboardPage.css";
import Navbar from "@/components/Navbar/Navbar";
import { registerUserTableEventHandler } from "@/socket/eventHandler";
import { getSocket } from "@/socket/websocket";
import { User } from "@/utils/types";
import { motion } from "framer-motion";

const UserLeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const userData = getUser();
  if (!userData) {
    navigate("/");
    return null; // or handle the null case appropriately
  }
  const token = getToken();
  const me: User = JSON.parse(userData);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchUsers(token);
    }
  }, [token]);

  const fetchUsers = (token: string) => {
    API.get<User[]>("/leaderboard", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      const sorted = [...res.data].sort((a, b) => b.score - a.score);
      setUsers(sorted);
    })
    .catch(() => navigate("/"));
  };

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      registerUserTableEventHandler(socket, () => users, setUsers, () => fetchUsers(token!));
    }
  }, [users, token]);

  const getRankEmoji = (index: number): string | null => {
    const emojis = ["👑", "🥈", "🥉"];
    return emojis[index] || null;
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
    >
      <Navbar />
      <div className="user-container">
        <div className="content-wrapper">
          <div className="greeting-row">
            <h2 className="greeting-text">Hello,</h2>
            <h2 className="greeting-name">{me?.firstname}</h2>
          </div>
          <div className="user-table">
            {users.map((user, index) => (
              <div key={user.uuid} className="user-row">
                <div className="avatar">{user.firstname[0]}</div>
                <div className="info">
                  <div>id: {user.uuid}</div>
                  <div>
                    {user.firstname.length > 12
                      ? `${user.firstname.slice(0, 12)}...`
                      : user.firstname}{" "}
                    {user.lastname.length > 12
                      ? `${user.lastname.slice(0, 12)}...`
                      : user.lastname}
                  </div>
                </div>
                <div className="ranked-score-wrapper">
                  <div className="rank-emoji">{getRankEmoji(index)}</div>
                  <div className="score-box">Score: {user.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserLeaderboardPage;
