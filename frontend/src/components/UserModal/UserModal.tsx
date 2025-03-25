import React, { useState, useEffect } from "react";
import "./UserModal.css";

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (user: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    gender: string;
    score: number;
  }) => void;
  newUser: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    gender: string;
    score: number;
  };
  setNewUser: React.Dispatch<
    React.SetStateAction<{
      username: string;
      password: string;
      firstname: string;
      lastname: string;
      gender: string;
      score: number;
    }>
  >;
  mode: "create" | "view-edit";
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  onSubmit,
  newUser,
  setNewUser,
  mode,
}) => {
  const [isEditing, setIsEditing] = useState(mode === "create");

  useEffect(() => {
    setIsEditing(mode === "create");
  }, [mode, visible]);

  const handleChange = (field: string, value: string | number) => {
    setNewUser({ ...newUser, [field]: value });
  };

  return (
    <div className={`modal-overlay ${visible ? 'active' : ''}`}>
      <div className="modal-box">
        <h3>
          {mode === "create"
            ? "Add New User"
            : isEditing
            ? "Edit User"
            : "User Details (View Mode)"}
        </h3>

        <div className="user-form">
            <input
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                    handleChange("username", e.target.value.slice(0, 32))  // Max (UI safe)
                }
                minLength={4}
                maxLength={80}
                required
                disabled={mode !== "create"}
            />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={!isEditing}
          />
          <input
            type="number"
            placeholder="Score"
            value={newUser.score.toString()}
            onChange={(e) => {
                // Trim leading zeros and clamp score between 0–9999
                const raw = e.target.value;
                const trimmed = raw.replace(/^0+(?=\d)/, ''); // remove leading zeros
                const num = Math.max(0, Math.min(9999, Number(trimmed)));
                handleChange("score", num);
            }}
            disabled={!isEditing}
          />
          <input
            placeholder="First name"
            value={newUser.firstname}
            onChange={(e) =>
                handleChange("firstname", e.target.value.slice(0, 32)) // enforce max
            }
            minLength={1}
            maxLength={80}
            required
            disabled={!isEditing}
         />
          <input
            placeholder="Last name"
            value={newUser.lastname}
            onChange={(e) =>
                handleChange("lastname", e.target.value.slice(0, 32))
            }
            minLength={1}
            maxLength={80}          
            required
            disabled={!isEditing}
            />
          <select
            value={newUser.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <div className="form-actions">
            {mode === "create" && (
              <>
                <button onClick={() => onSubmit(newUser)}>Submit</button>
                <button onClick={onClose}>Cancel</button>
              </>
            )}

            {mode === "view-edit" && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={onClose}>Close</button>
              </>
            )}

            {mode === "view-edit" && isEditing && (
              <>
                <button
                  onClick={() => {
                    onSubmit(newUser);
                    setIsEditing(false);
                  }}
                >
                  Save
                </button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
