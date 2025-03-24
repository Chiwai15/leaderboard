import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { getToken, getUserRole } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import "./AdminLeaderboardPage.css";
import Navbar from "@/components/Navbar/Navbar";
import UserModal from "@/components/UserModal/UserModal";
import QuantitySelector from "@/components/QuantitySelector/QuantitySelector";
import { validateUserInput } from "@/validators/userValidator";
import { FaTrash, FaEye } from "react-icons/fa";
import { showToastOnce } from "@/utils/toastUtils";
import { toast } from "react-toastify";
type User = {
  uuid: string;
  firstname: string;
  lastname: string;
  gender: string;
  score: number;
};

const AdminLeaderboardPage: React.FC = () => {
  const role = getUserRole();

  useEffect(() => {
      if (role === "admin") navigate("/admin-leaderboard");
      else navigate("/leaderboard");
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view-edit'>('create');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    gender: "male",
    score: 0,
  });
  const navigate = useNavigate();

  const token = getToken();

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchUsers = () => {
    API.get("/leaderboard", { headers })
      .then((res) => {
        console.log("Fetched users:", res.data); // Log the data here
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err); // Optional: log the error
        navigate("/");
      });
  };

  const handleUpdateUser = (user: typeof newUser) => {
    if (!selectedUserId) return;
  
    API.patch(`/users/${selectedUserId}`, user, { headers }).then(() => {
      setShowModal(false);
      setSelectedUserId(null);
      fetchUsers();
    });
  };
  
  useEffect(() => {
    if (!token) navigate("/");
    else fetchUsers();
  }, []);

  const handleCreateUser = () => {
    const error = validateUserInput(newUser);
    if (error) {
      showToastOnce(error, toast.error);
      return;
    }
  
    setShowModal(false);
    API.post("/users", newUser, { headers }).then(() => {
      setNewUser({ firstname: "", lastname: "", gender: "male", username: "", password: "" , score: 0});
      fetchUsers();
    });
  };

  const handleDelete = (id: string) => {
    API.delete(`/users/${id}`, { headers }).then(fetchUsers);
  };

  const handleScoreChange = (id: string, action: "increase" | "decrease") => {
    if (!id) {
        console.warn("No user ID provided to handleScoreChange!");
        return;
      }
    console.log("Changing score:", id, action);
    API.patch(`/users/${id}/${action}`, {}, { headers }).then(fetchUsers);
  };


  // Action Bar
  const handleExportCSV = async () => {
    const token = getToken();
  
    try {
      const res = await fetch("http://localhost:5001/export/csv", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "leaderboard.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    }
  };
  
  
  const handleExportPDF = async () => {
    const token = getToken();
  
    try {
      const res = await fetch("http://localhost:5001/export/pdf", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "leaderboard.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div>
        <Navbar />
        <div className="container">

        <div className="content-wrapper">
            <div className="greeting-row">
                <h2 className="greeting-text">Hello,</h2>
                <h2 className="greeting-name">Admin</h2>
            </div>
            <div className="action-bar">
                <button
                onClick={() => {
                    setNewUser({ username: "", password: "", firstname: "", lastname: "", gender: "male", score: 0 });
                    setModalMode("create");
                    setShowModal(true);
                    setSelectedUserId(null);
                }}
                className="add-user-btn"
                >                    
                + Add User
                </button>

                {/* export buttons */}
                <div className="export-dropdown">
                <button className="export-btn">Export ▼</button>
                <div className="export-options">
                    <div onClick={handleExportCSV}>Export CSV</div>
                    <div onClick={handleExportPDF}>Export PDF</div>
                </div>
                </div>
            </div>

            {/* Modal form */}
            <UserModal
                visible={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUserId(null);
                }}
                onSubmit={modalMode === 'create' ? handleCreateUser : handleUpdateUser}
                newUser={newUser}
                setNewUser={setNewUser}
                mode={modalMode}
            />

            <div className="user-table">
            {users.map((user) => (
                <div key={user.uuid} className="user-row">
                {/* Leftmost: Delete button */}
                <div className="delete-btn">
                    <button onClick={() => handleDelete(user.uuid)} title="Delete User">
                    <FaTrash />
                    </button>
                </div>

                {/* Avatar */}
                <div className="avatar">{user.firstname[0]}</div>

                {/* Info */}
                <div className="info">
                    <div>id: {user.uuid}</div>
                    <div>
                    {user.firstname.length > 12
                        ? user.firstname.slice(0, 12) + "..."
                        : user.firstname}{" "}
                    {user.lastname.length > 12
                        ? user.lastname.slice(0, 12) + "..."
                        : user.lastname}{" "}
                    </div>
                </div>

                {/* Actions */}
                <div className="actions">
                    <QuantitySelector
                    value={user.score}
                    increase={() => handleScoreChange(user.uuid, "increase")}
                    decrease={() => handleScoreChange(user.uuid, "decrease")}
                    disableIncrease={user.score >= 9999}
                    disableDecrease={user.score <= 0}
                    />

                    {/* View Details Button */}
                    <button className="view-btn"
                        onClick={() => {
                            setNewUser({ ...user, username: "", password: "" }); // fill only fields you allow editing
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
    </div>
  );
};
export default AdminLeaderboardPage;


