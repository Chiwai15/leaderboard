// src/pages/AdminLeaderboardPage.tsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEye } from "react-icons/fa";
import { getToken, getUserRole } from "@/services/auth";
import { validateUserInput } from "@/validators/userValidator";
import { showToastOnce } from "@/utils/toastUtils";
import { toast } from "react-toastify";
import { filterFields } from "@/utils/objectUtils";
import { handleApiError } from "@/utils/errorUtils";
import { registerUserTableEventHandler } from "@/socket/eventHandler";
import { getSocket } from "@/socket/websocket";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar/Navbar";
import UserModal from "@/components/UserModal/UserModal";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import "./AdminLeaderboardPage.css";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserScore,
} from "@/services/userApi";

import { User } from "@/utils/types";

const AdminLeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();
  const role = getUserRole();
  const headers = { Authorization: `Bearer ${token}` };
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view-edit">("create");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    gender: "male",
    score: 0,
  });

  useEffect(() => {
    if (role !== "admin") navigate("/leaderboard");
  }, []);

  useEffect(() => {
    if (!token) navigate("/");
    else fetchUsers();
  }, []);


  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      registerUserTableEventHandler(socket, () => users, setUsers, fetchUsers);
    }
  }, [users]); // Run this useEffect whenever the value of users changes.


  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150); // Delay before closing
  };

  const fetchUsers = () => {
    getUsers(headers)
      .then((res) => setUsers(res.data))
      .catch((err) => {
        const msg = err?.response?.data?.error || "Failed to fetch users.";
        showToastOnce(msg, toast.error);
        navigate("/");
      });
  };


  const handleCreateUser = () => {
    const error = validateUserInput(newUser);
    if (error) {
      showToastOnce(error, toast.error);
      return;
    }
  
    createUser(newUser, headers)
      .then(() => {
        setShowModal(false);
        setNewUser({
          username: "",
          password: "",
          firstname: "",
          lastname: "",
          gender: "male",
          score: 0,
        });
        fetchUsers();
        showToastOnce("User added successfully", toast.success);
      })
      .catch((err) => handleApiError(err, "Failed to create user."));
  };
  
  const handleUpdateUser = (user: typeof newUser) => {
    if (!selectedUserId) return;
  
    const allowedFields: (keyof typeof newUser)[] = [
      "firstname",
      "lastname",
      "gender",
      "score",
      "password",
    ];
    const filteredUser = filterFields(user, allowedFields);
  
    updateUser(selectedUserId, filteredUser, headers)
      .then(() => {
        setShowModal(false);
        setSelectedUserId(null);
        fetchUsers();
        showToastOnce("User updated successfully", toast.success);
      })
      .catch((err) => handleApiError(err, "Failed to update user."));
  };
  
  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    deleteUser(id, headers)
      .then(() => {
        fetchUsers();
        showToastOnce("User deleted", toast.success);
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || "Failed to delete user.";
        showToastOnce(msg[0], toast.error);
      });
  };

  const handleScoreChange = (id: string, action: "increase" | "decrease") => {
    const user = users.find((u) => u.uuid === id);
    if (!user) return;

    if (action === "increase" && user.score >= 9999) {
      showToastOnce("Max score is 9999", toast.warning);
      return;
    }
    if (action === "decrease" && user.score <= 0) {
      showToastOnce("Score cannot go below 0", toast.warning);
      return;
    }

    changeUserScore(id, action, headers)
      .then(() => {
        fetchUsers();
        showToastOnce("Score updated", toast.success);
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || "Failed to update score.";
        showToastOnce(msg, toast.error);
      });
  };

  const handleExport = async (type: "csv" | "pdf") => {
    try {
      const res = await fetch(`http://localhost:5001/export/${type}`, {
        method: "GET",
        headers,
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leaderboard.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showToastOnce(`${type.toUpperCase()} exported`, toast.success);
    } catch (err: unknown) {
        const fallbackMsg = `${type.toUpperCase()} export failed.`;
    
        const msg =
          (err as any)?.response?.data?.error ||
          (err as Error)?.message ||
          fallbackMsg;
    
        showToastOnce(msg, toast.error);
      }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.8 }}    
    >
      <Navbar />
      <div className="container">
        <div className="content-wrapper">
          <div className="greeting-row">
            <h2 className="greeting-text">Hello,</h2>
            <h2 className="greeting-name">Admin</h2>
          </div>

          <div className="action-bar">
            <button
              className="add-user-btn"
              onClick={() => {
                setNewUser({
                  username: "",
                  password: "",
                  firstname: "",
                  lastname: "",
                  gender: "male",
                  score: 0,
                });
                setModalMode("create");
                setShowModal(true);
                setSelectedUserId(null);
              }}
            >
              + Add User
            </button>

            <div
                className="export-dropdown"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button className="export-btn">Export ▼</button>
                {isDropdownOpen && (
                <div className={`export-options ${isDropdownOpen ? "visible" : "hidden"}`}>
                    <div onClick={() => handleExport("csv")}>Export CSV</div>
                    <div onClick={() => handleExport("pdf")}>Export PDF</div>
                </div>
                )}
            </div>
          </div>

          <UserModal
            visible={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedUserId(null);
            }}
            onSubmit={modalMode === "create" ? handleCreateUser : handleUpdateUser}
            newUser={newUser}
            setNewUser={setNewUser}
            mode={modalMode}
          />

          <div className="user-table">
            {users.map((user) => (
              <div key={user.uuid} className="user-row">
                <div className="delete-btn">
                  <button onClick={() => handleDelete(user.uuid)} title="Delete User">
                    <FaTrash />
                  </button>
                </div>

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

                <div className="actions">
                  <QuantitySelector
                    value={user.score}
                    increase={() => handleScoreChange(user.uuid, "increase")}
                    decrease={() => handleScoreChange(user.uuid, "decrease")}
                    disableIncrease={user.score >= 10000} // 9999 is the maximum score
                    disableDecrease={user.score <= -1}  // 0 is the minimum score
                  />

                  <button
                    className="view-btn"
                    onClick={() => {
                      setNewUser({ ...user, username: "", password: "" });
                      setSelectedUserId(user.uuid);
                      setModalMode("view-edit");
                      setShowModal(true);
                    }}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLeaderboardPage;
