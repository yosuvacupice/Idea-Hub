import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { RiDashboardLine, RiUserLine, RiUploadLine, RiMessage2Line } from "react-icons/ri";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="logo">IdeaHub</h2>

      <ul>
        <li
  className={
    location.pathname.startsWith("/home") ||
    location.pathname.startsWith("/idea")
      ? "active-menu"
      : ""
  }
  onClick={() => navigate("/home")}
>
  <RiDashboardLine /> Dashboard
</li>

        <li
  className={location.pathname.startsWith("/profile") ? "active-menu" : ""}
  onClick={() => navigate("/profile")}
>
  <RiUserLine /> Profile
</li>


        <li
          className={location.pathname.startsWith("/upload") ? "active-menu" : ""}
          onClick={() => navigate("/upload")}
        >
          <RiUploadLine /> Upload
        </li>
        
        <li
  className={location.pathname.startsWith("/messages") ? "active-menu" : ""}
  onClick={() => navigate("/messages")}
>
  <RiMessage2Line /> Messages
</li>

      </ul>
    </div>
  );
}

export default Sidebar;
