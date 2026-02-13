import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PostCard from "../components/PostCard";
import "../styles/Home.css";
import { useLocation } from "react-router-dom";
import api from "../api";

function Home() {
  const [ideas, setIdeas] = useState([]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("others");
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = localStorage.getItem("username");

  //  Set active tab when coming from upload
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
  if (location.state?.searchQuery) {
    setSearchQuery(location.state.searchQuery);
  } else {
    setSearchQuery("");
  }
}, [location]);



  //  Fetch ideas function (used for refresh also)
  const fetchIdeas = () => {
    api
      .get("/api/ideas/")
      .then((res) => setIdeas(res.data))
      .catch((err) => console.log(err));
  };

  // Load once
  useEffect(() => {
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter((idea) =>
  idea.title.toLowerCase().includes(searchQuery.toLowerCase())
);

const otherPosts = filteredIdeas.filter(
  (i) => i.user_name !== currentUser
);

const myPosts = filteredIdeas.filter(
  (i) => i.user_name === currentUser
);


  return (
    <div className="layout">
      <Sidebar />

      <div className="main">

        <div className="fixed-top">
          <Topbar />

          <div className="tabs">
            <button
              className={activeTab === "others" ? "active" : ""}
              onClick={() => setActiveTab("others")}
            >
              Other Posts
            </button>

            <button
              className={activeTab === "mine" ? "active" : ""}
              onClick={() => setActiveTab("mine")}
            >
              My Posts
            </button>
          </div>
        </div>

        <div className="content">

          {activeTab === "others" &&
            otherPosts.map((idea) => (
              <PostCard
                key={idea.id}
                idea={idea}
                refreshPosts={fetchIdeas}
              />
            ))}

          {activeTab === "mine" &&
            myPosts.map((idea) => (
              <PostCard
                key={idea.id}
                idea={idea}
                refreshPosts={fetchIdeas}
              />
            ))}

        </div>

      </div>
    </div>
  );
}

export default Home;
