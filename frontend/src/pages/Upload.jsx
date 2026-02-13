import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("Title and Description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    api.post("/api/ideas/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }).then(() => {
      navigate("/home", { state: { activeTab: "mine" } });
    }).catch(() => {
      setError("Upload failed.");
    });
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="content upload-wrapper">
          <div className="upload-card">
            <h2>Upload Idea</h2>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit}>

              <label>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button type="submit" className="upload-btn">
                Upload
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Upload;
