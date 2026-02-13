import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Home.css";
import {
  RiThumbUpLine,
  RiThumbDownLine,
  RiStarFill,
  RiMessage2Line
} from "react-icons/ri";
import api from "../api";

function IdeaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [comment, setComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [userVote, setUserVote] = useState(null);

  const token = localStorage.getItem("access");
  const currentUser = localStorage.getItem("username");

  const fetchIdea = () => {
    api
      .get(`/api/ideas/${id}/`)
      .then((res) => {
        setIdea(res.data);
        setSelectedRating(res.data.average_rating || 0);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const handleVote = (value) => {
    api.post(
      `/api/ideas/${id}/vote/`,
      { value },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setUserVote(value);
      fetchIdea();
    });
  };

  const handleRating = (value) => {
    api.post(
      `/api/ideas/${id}/rate/`,
      { value },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setSelectedRating(value);
    });
  };

  const handleComment = () => {
    if (!comment.trim()) return;

    api.post(
      `/api/ideas/${id}/comments/`,
      { content: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
      setIdea((prev) => ({
        ...prev,
        comments: [...prev.comments, res.data]
      }));
      setComment("");
    });
  };

  // Message icon click
  const handleMessageClick = (username) => {
    if (username === currentUser) {
      alert("You cannot message yourself.");
      return;
    }

    navigate("/messages", {
      state: { receiver: username }
    });
  };

  if (!idea) return <p>Loading...</p>;

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="content">
          <div className="post-card">

            <h2>{idea.title}</h2>
            <p>{idea.description}</p>

            <div className="post-info">

              {/* LIKE */}
              <div className="info-item" onClick={() => handleVote(1)}>
                <RiThumbUpLine
                  className={
                    userVote === 1
                      ? "info-icon like-active"
                      : "info-icon"
                  }
                />
                <span>{idea.like_count}</span>
              </div>

              {/* DISLIKE */}
              <div className="info-item" onClick={() => handleVote(-1)}>
                <RiThumbDownLine
                  className={
                    userVote === -1
                      ? "info-icon dislike-active"
                      : "info-icon"
                  }
                />
                <span>{idea.dislike_count}</span>
              </div>

              {/* RATING */}
              <div className="rating-stars">
                {[1,2,3,4,5].map((star) => (
                  <RiStarFill
                    key={star}
                    className={
                      star <= selectedRating
                        ? "star-active"
                        : "star-inactive"
                    }
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>

            </div>

            <hr style={{ margin: "30px 0" }} />

            <h3>Comments</h3>

            <div className="comments-section">
              {idea.comments.map((c) => (
                <div key={c.id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-user">
                      {c.user_name}
                    </span>

                    {/* Message icon click */}
                    <RiMessage2Line
                      className="msg-icon"
                      onClick={() => handleMessageClick(c.user_name)}
                    />
                  </div>

                  <p className="comment-text">{c.content}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "20px" }}>
              <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleComment} className="comment-btn">
                Post Comment
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default IdeaDetails;
