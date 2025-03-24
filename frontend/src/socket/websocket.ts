import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let isConnected = false;

export const connectSocket = (token: string) => {
  if (isConnected) return; // Already connected and listeners bound

  socket = io("http://localhost:5001", {
    transports: ["websocket"],
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id);
    isConnected = true;
  });

  socket.on("disconnect", () => {
    console.log("[Socket] Disconnected");
    isConnected = false;
    sessionStorage.removeItem("token");
    window.location.href = "/"; // Or use router
    toast.warning("You have been logged out due to another login.");
  });

  socket.on("user_online", (data) => {
    console.log("[Socket] user_online:", data);
  });

  socket.on("user_offline", (data) => {
    console.log("[Socket] user_offline:", data);
  });

  socket.on("custom_pong", (data) => {
    console.log("[Socket] Pong:", data);
  });

  socket.on("try_connect", (data) => {
    console.log("try_connect", data);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection failed:", err.message);
  });

  socket.on("data_change", (payload) => {
    console.log("[Socket] Data change received:", payload);
  });
};

export const emitDataChangeEvent = <T>(event: string, data: T): void => {
  if (!socket || !socket.connected) return;
  socket.emit("data_change", { event, data });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

export const getSocket = () => socket;
