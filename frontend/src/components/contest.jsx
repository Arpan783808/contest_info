import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "../compcss/home.css";
import Contestlist from "./contestlist.jsx";
import Contestlistatcoder from "./contestlistatcoder.jsx";
export const Contest = () => {
  const [atcoderupcoming,setAtcoder]=useState([]);
  const [atcoderpast,setAtcoderPast]=useState([]);
  const [contests, setContests] = useState([]);
  const [view, setView] = useState("cf");
  const navigate = useNavigate();
  const host = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`${host}/codeforcecontest`);
        if (response.data.success) {
          const sortedContests = response.data.contests.sort(
            (a, b) => a.start_time - b.start_time
          );
          setContests(sortedContests);
        }
        const response1=await axios.get(`${host}/atcoder`);
        setAtcoder(response1.data.upcoming);
        setAtcoderPast(response1.data.past);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchContest();
  }, []);
  console.log(atcoderupcoming);
  const finishedContests = contests
    .filter((contest) => contest.status === "finished")
    .sort((a, b) => b.start_time - a.start_time);
  const ongoingContests = contests.filter(
    (contest) => contest.status === "ongoing"
  );
  const upcomingContests = contests.filter(
    (contest) => contest.status === "before"
  );
  const handleView = (e) => {
    setView(e.target.value);
  };
  const handleNav = () => {
    navigate("/");
  };
  const handleLeaderboard = (e) => {
    navigate("/leaderboard");
  };
  // useEffect(() => {
  //   console.log(contests);
  // }, [contests]);
  return (
    <div className="contestpage">
      <div className="header">
        <button value="cf" className="codeforcebutton" onClick={handleView}>
          Codeforces
        </button>
        <button
          value="atcoder"
          className="codeforcebutton"
          onClick={handleView}
        >
          Atcoder
        </button>
        {/* <button value="atcoder" className="codeforcebutton" onClick={handleNav}>
          user
        </button> */}
        <button
          value="cf"
          className="codeforcebutton"
          onClick={handleLeaderboard}
        >
          Leaderboard
        </button>
      </div>

      {view === "cf" && (
        <div className="category1">
          <Contestlist
            contests={upcomingContests}
            category="Upcoming Contests"
          />
          <Contestlist
            contests={finishedContests}
            category="Finished Contests"
          />
        </div>
      )}
      {view === "atcoder" && (
        <div className="category1">
          <Contestlistatcoder
            contests={atcoderupcoming}
            category="Upcoming Contests"
          />
          <Contestlistatcoder
            contests={atcoderpast}
            category="Finished Contests"
          />
        </div>
      )}
    </div>
  );
};
