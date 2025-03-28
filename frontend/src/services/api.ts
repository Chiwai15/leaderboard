import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001", // Flask backend
  withCredentials: true, // send cookies
});

export default API;
