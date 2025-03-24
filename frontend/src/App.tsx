import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {

  return (
    <>
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={1000} limit={2} />
    </>
  );
};

export default App;