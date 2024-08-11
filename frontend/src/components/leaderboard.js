import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "../compcss/leaderboard.css";
const Leaderboard = () => {
    const navigate=useNavigate();
  const [users, setUsers] = useState([]);
  const host = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${host}/leaderboard`);

      setUsers(response.data);
    };

    fetchUsers();
  }, []);
  const handleHome=()=>{
    navigate("/");
  }
  return (
    <div className="headerleaderboard">
      <button className="homebutton" onClick={handleHome}>Home</button>
      <h1>ATCODER</h1>
      <table className="tableprofile">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Rating</th>
            <th>Highest Rating</th>
            <th>Rated Matches</th>
            <th>Last Competed</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.username}>
              <td>{user.Rank ?? "NA"}</td>
              <td>
                <a
                  href={`https://atcoder.jp/users/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.username}
                </a>
              </td>
              <td>{user.Rating ?? "NA"}</td>
              <td>{user.HighestRating ?? "NA"}</td>
              <td>{user.RatedMatches ?? "NA"}</td>
              <td>{user.LastCompeted ?? "NA"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
