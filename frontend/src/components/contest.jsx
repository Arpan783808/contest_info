import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "../compcss/home.css";
import Contestlist from "./contestlist.jsx";
import Contestlistatcoder from "./contestlistatcoder.jsx";
import Contestlistcodechef from "./contestlistcodechef.jsx";
import LoadingSpinner from "./loader.jsx";
export const Contest = () => {
  const [atcoderupcoming, setAtcoder] = useState([]);
  const [atcoderpast, setAtcoderPast] = useState([]);
  const [codechef, setCodechef] = useState([]);
  const [codechefpast, setCodechefpast] = useState([]);
  const [contests, setContests] = useState([]);
  const [view, setView] = useState("cf");
  const navigate = useNavigate();
  const host = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`${host}/codeforcecontest`);
        const res = await axios.get(`${host}/codechef`);
        setCodechef(res.data.upcoming);
        setCodechefpast(res.data.past);
        if (response.data.success) {
          const sortedContests = response.data.contests.sort(
            (a, b) => a.start_time - b.start_time
          );
          setContests(sortedContests);
        }
        const response1 = await axios.get(`${host}/atcoder`);
        setAtcoder(response1.data.upcoming);
        setAtcoderPast(response1.data.past);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchContest();
  }, []);
  // console.log(atcoderupcoming);
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
  const handleLeaderboard = (e) => {
    navigate("/leaderboard");
  };
  const handleleetcode = (url) => {
    window.open(url, "_blank");
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
        <button
          value="cf"
          className="codeforcebutton"
          onClick={handleLeaderboard}
        >
          Leaderboard
        </button>
        <button
          value="codechef"
          className="codeforcebutton"
          onClick={handleView}
        >
          Codechef
        </button>
        <button className="codeforcebutton" onClick={()=>handleleetcode("https://leetcode-leaderboard-2.onrender.com/")}>Leetcode</button>
      </div>

      {loading ? (
        <LoadingSpinner /> // Or use a spinner component
      ) : (
        <div className="category1">
          {view === "cf" && (
            <>
              <Contestlist
                contests={upcomingContests}
                category="UPCOMING CONTESTS"
              />
              <Contestlist
                contests={finishedContests}
                category="PAST CONTESTS"
              />
            </>
          )}
          {view === "atcoder" && (
            <>
              <Contestlistatcoder
                contests={atcoderupcoming}
                category="UPCOMING CONTESTS"
              />
              <Contestlistatcoder
                contests={atcoderpast}
                category="PAST CONTESTS"
              />
            </>
          )}
          {view === "codechef" && (
            <>
              <Contestlistcodechef
                contests={codechef}
                category="UPCOMING CONTESTS"
              />
              <Contestlistcodechef
                contests={codechefpast}
                category="PAST CONTESTS"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
