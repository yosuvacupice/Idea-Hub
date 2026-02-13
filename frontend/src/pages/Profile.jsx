import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", email: "" });
  useEffect(() => {
  const token = localStorage.getItem("access");

  axios.get("http://127.0.0.1:8000/api/ideas/me/", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => {
    setUserData(res.data);
  });
}, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="content profile-wrapper">
          <div className="profile-card">
            <h2 className="profile-title">Profile</h2>

            <div className="profile-field">
              <label>Username</label>
              <input type="text" value={userData.username} disabled />
            </div>

            <div className="profile-field">
              <label>Email</label>
              <input type="text" value={userData.email} disabled />
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
