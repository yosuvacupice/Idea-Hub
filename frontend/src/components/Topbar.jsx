import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Topbar() {
  const username = localStorage.getItem("username") || "User";
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate("/home", { state: { searchQuery: search } });
    }
  };

  return (
    <div className="topbar">
      <input
        type="text"
        placeholder="Search ideas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
      />

      <div
        className="user-name"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/profile")}
      >
        👤 {username}
      </div>
    </div>
  );
}

export default Topbar;
