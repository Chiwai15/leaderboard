import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { getToken, getUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import "./UserLeaderboardPage.css";
import Navbar from "@/components/Navbar/Navbar";
import { registerUserTableEventHandler } from "@/socket/eventHandler";
import { getSocket } from "@/socket/websocket";

const UserLeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const token = getToken();
  const me = JSON.parse(getUser());
  useEffect(() => {
    if (!token) navigate("/");
    else fetchUsers();
  }, []);

  const fetchUsers = () => {
    API.get("/leaderboard", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => b.score - a.score);
        setUsers(res.data);
      })
      .catch(() => navigate("/"));
  };

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      registerUserTableEventHandler(socket, () => users, setUsers, fetchUsers);
    }
  }, [users]);


  const getRankEmoji = (index: number) => {
    const emojis = ["👑", "🥈", "🥉"];
    return emojis[index] || null;
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="content-wrapper">
          <div className="greeting-row">
            <h2 className="greeting-text">Hello,</h2>
            <h2 className="greeting-name">{me.firstname}</h2>
          </div>
          <div className="user-table">
            {users.map((user, index) => (
              <div key={user.uuid} className="user-row">
                <div className="avatar">{user.firstname[0]}</div>
                <div className="info">
                  <div>id: {user.uuid}</div>
                  <div>
                    {user.firstname.length > 12
                      ? user.firstname.slice(0, 12) + "..."
                      : user.firstname}{" "}
                    {user.lastname.length > 12
                      ? user.lastname.slice(0, 12) + "..."
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
    </div>
  );
};

export default UserLeaderboardPage;