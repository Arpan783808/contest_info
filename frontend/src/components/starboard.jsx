import React, { useEffect, useState } from "react";
import "../compcss/starboard.css";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import home from "../assets/home.png";
import game1 from "../assets/game1.png";
import game2 from "../assets/game2.png";
import LoadingSpinner from "./loader.jsx";
const host = process.env.REACT_APP_BACKEND_URL;

const Starboard = () => {
  const [starboard, setstar] = useState([]);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchboard = async () => {
      try {
        const res = await axios.get(`${host}/starboard`);

        if (res.data.success) {
          setstar(res.data.starboard);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchboard();
  }, []);
  console.log(starboard);
  const handleHome = () => {
    navigate("/");
  };
  const getRankBadge = (index) => {
    if (index === 0) return "🥇"; // Gold for 1st rank
    if (index === 1) return "🥈"; // Silver for 2nd rank
    if (index === 2) return "🥉"; // Bronze for 3rd rank
    return index + 1; // Show number for ranks other than top 3
  };
  const getbadge = (index) => {
    if (index === 0) return "👑"; // Gold for 1st rank
    if (index === 1) return "🐲"; // Silver for 2nd rank
    if (index === 2) return "🏹";
    if (index == 3) return "⚔️"; // Bronze for 3rd rank
    return "🛡️"; // Show number for ranks other than top 3
  };
  const getrank = (index) => {
    if (index === 0) return "CHAMPION"; // Gold for 1st rank
    if (index === 1) return "DRAGON SLAYER"; // Silver for 2nd rank
    if (index === 2) return "RANGER";
    if (index == 3) return "SQUIRE"; // Bronze for 3rd rank
    return "NOOB";
  };
  const handleUserClick = (index) => {
    // Toggle the active user on click
    setHoveredUser(hoveredUser === index ? null : index);
  };
  return (
    <div className="fullstarboard">
      <img src={home} className="homebutton1" onClick={handleHome} />
      <div className="starhead">
        <div className="game1">
          <img src={game1} />
        </div>
        <div className="starboard">
          <h1>STARBOARD</h1>
        </div>
      </div>
      <div className="tablehead">
        <div className="first f">
          <p>Rank</p>
        </div>
        <div className="second f">
          <p>Username</p>
        </div>
        <div className="third f">
          <p>Codeforces Score</p>
        </div>
        <div className="fourth f">
          <p>Leetcode Score</p>
        </div>
        <div className="fifth f">
          <p>Tag</p>
        </div>
        <div className="sixth f">
          <p>Badge</p>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner /> // Or use a spinner component
      ) : (
        <div className="startable">
          {starboard?.map((star, index) => (
            <React.Fragment key={star.username || index}>
              <div className="starcard" onClick={() => handleUserClick(index)}>
                <div className="first">
                  <p>{getRankBadge(index)}</p>
                </div>
                <div className="second">
                  <p>{star.username}</p>
                </div>
                <div className="third">
                  <p>{star.codeforces?.score || 0}</p>
                </div>
                <div className="fourth">
                  <p>{star.leetcode?.score || 0}</p>
                </div>
                <div className="fifth">
                  <p>{getrank(index)}</p>
                </div>
                <div className="sixth f1">
                  <p>{getbadge(index)}</p>
                </div>
              </div>

              {/* Additional Info div is rendered below the card */}
              {hoveredUser === index && (
                <div className="extra-info">
                  <div className="cfinfo">
                    <h3>Codeforces Info</h3>
                    <p>Problems Solved: {star.codeforces.problems}</p>
                    <p>Contests Given: {star.codeforces.contest}</p>
                    <p>Avg problem rating: {star.codeforces.avgrating}</p>
                    <p>Rating Change:{star.codeforces.ratingchange}</p>
                    <p>Score:{star.codeforces.score}</p>
                  </div>
                  <div className="cfinfo">
                    <h3>LeetCode Info</h3>
                    <p>Problems Solved: {star.leetcode.problems}</p>
                    <p>Contests Given: {star.leetcode.contest}</p>
                    <p>Avg problem rating: {star.leetcode.avgrating}</p>
                    <p>Rating Change: {star.leetcode.ratingchange}</p>
                    <p>Score:{star.leetcode.score}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Starboard;
