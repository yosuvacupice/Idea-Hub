import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/Home.css";
import { useLocation } from "react-router-dom";

function Messages() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [content, setContent] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("access");
  const currentUser = localStorage.getItem("username");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.receiver) {
      setActiveTab("sent");
      setReceiver(location.state.receiver);
    }
  }, [location.state]);

  // Load messages properly
  const fetchMessages = () => {
    axios
      .get("http://127.0.0.1:8000/api/ideas/messages/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMessages(res.data));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Load users
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/ideas/")
      .then(res => {
        const uniqueUsers = [...new Set(res.data.map(i => i.user_name))];
        setUsers(uniqueUsers.filter(u => u !== currentUser));
      });
  }, []);

  const handleUserSearch = (value) => {
    setReceiver(value);
    const filtered = users.filter(u =>
      u.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSend = () => {
  if (!receiver || !content.trim()) return;

  if (receiver === currentUser) {
    alert("You cannot send message to yourself.");
    return;
  }

  axios.post(
    "http://127.0.0.1:8000/api/ideas/messages/",
    { receiver_username: receiver, content },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(() => {
    setContent("");
    setReceiver("");
    setFilteredUsers([]);
    fetchMessages();
    setActiveTab("sent");

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  });
};


  // STRICT FILTER
  const inboxMessages = messages.filter(
  m =>
      m.receiver_name &&
      m.receiver_name.trim().toLowerCase() === currentUser.trim().toLowerCase()
  );

  const sentMessages = messages.filter(
    m =>
      m.sender_name &&
      m.sender_name.trim().toLowerCase() === currentUser.trim().toLowerCase()
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />

        <div className="content">

          <div className="tabs">
            <button
              className={activeTab === "inbox" ? "active" : ""}
              onClick={() => setActiveTab("inbox")}
            >
              Inbox
            </button>

            <button
              className={activeTab === "sent" ? "active" : ""}
              onClick={() => setActiveTab("sent")}
            >
              Sent
            </button>
          </div>

          {/* INBOX */}
          {activeTab === "inbox" && (
            <div>
              {inboxMessages.map(msg => (
                <div key={msg.id} className="message-card">
                  <strong>{msg.sender_name}</strong>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* SENT */}
          {activeTab === "sent" && (
            <div>

              <h2>Send To:</h2>
              <input
                type="text"
                value={receiver}
                onChange={(e) => handleUserSearch(e.target.value)}
                placeholder="Type username..."
                className="message-input"
              />

              {filteredUsers.length > 0 && (
                <div className="user-suggestions">
                  {filteredUsers.map(u => (
                    <div
                      key={u}
                      className="suggestion-item"
                      onClick={() => {
                        setReceiver(u);
                        setFilteredUsers([]);
                      }}
                    >
                      {u}
                    </div>
                  ))}
                </div>
              )}

              <h2>Message:</h2>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your message..."
                className="message-textarea"
              />

              <button onClick={handleSend} className="send-btn">
                Send
              </button>

              <hr style={{ margin: "30px 0" }} />

              {sentMessages.map(msg => (
                <div key={msg.id} className="message-card">
                  <strong>To: {msg.receiver_name}</strong>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}
          {showPopup && (
  <div className="message-popup">
    Message Sent Successfully 
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default Messages;
