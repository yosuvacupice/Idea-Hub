import { 
  RiThumbUpLine, 
  RiStarLine, 
  RiChat1Line,
  RiEditLine,
  RiDeleteBinLine
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

function PostCard({ idea, refreshPosts }) {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("username");
  const token = localStorage.getItem("access");

  const isMine = idea.user_name === currentUser;

  const handleDelete = (e) => {
    e.stopPropagation();

    if (!window.confirm("Delete this post?")) return;

    axios.delete(
      `http://127.0.0.1:8000/api/ideas/${idea.id}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      refreshPosts();
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();

    const newTitle = prompt("Edit title:", idea.title);
    const newDesc = prompt("Edit description:", idea.description);

    if (!newTitle || !newDesc) return;

    axios.put(
      `http://127.0.0.1:8000/api/ideas/${idea.id}/`,
      {
        title: newTitle,
        description: newDesc
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      refreshPosts();
    });
  };

  return (
    <div
      className="post-card clickable"
      onClick={() => navigate(`/idea/${idea.id}`)}
    >
      <h3>{idea.title}</h3>
      <p className="post-preview">
        {idea.description.length > 80
          ? idea.description.substring(0, 80) + "..."
          : idea.description}
      </p>

      <div className="post-info">
        <div className="info-item">
          <RiThumbUpLine className="info-icon like" />
          <span>{idea.like_count}</span>
        </div>

        <div className="info-item">
          <RiStarLine className="info-icon star" />
          <span>{idea.average_rating}</span>
        </div>

        <div className="info-item">
          <RiChat1Line className="info-icon comment" />
          <span>{idea.comments.length}</span>
        </div>
      </div>

      {isMine && (
        <div className="post-actions">
          <RiEditLine onClick={handleEdit} />
          <RiDeleteBinLine onClick={handleDelete} />
        </div>
      )}
    </div>
  );
}

export default PostCard;
