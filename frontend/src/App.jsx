import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IdeaDetails from "./pages/IdeaDetails";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";


function App() {
  const handleLogout = () => {
  localStorage.removeItem("access");
  alert("Logged out successfully!");
  window.location.href = "/";
};

  return (
    <div>

      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/home" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/idea/:id" element={<IdeaDetails />} />
  <Route path="/messages" element={<Messages />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/upload" element={<Upload />} />

</Routes>

    </div>
  );
}

export default App;
