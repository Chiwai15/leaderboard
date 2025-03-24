import API from "./api";

export const getUsers = (headers: object) => {
  return API.get("/leaderboard", { headers });
};

export const createUser = (user: {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: string;
  score: number;
}, headers: object) => {
  return API.post("/users", user, { headers });
};

export const updateUser = (
  userId: string,
  data: Partial<{
    firstname: string;
    lastname: string;
    gender: string;
    score: number;
    password: string;
  }>,
  headers: object
) => {
  return API.patch(`/users/${userId}`, data, { headers });
};

export const deleteUser = (userId: string, headers: object) => {
  return API.delete(`/users/${userId}`, { headers });
};

export const changeUserScore = (
  userId: string,
  action: "increase" | "decrease",
  headers: object
) => {
  return API.patch(`/users/${userId}/${action}`, {}, { headers });
};