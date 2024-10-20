import React from "react";
import "../compcss/contestcard.css";
export const Contestcardatcoder = ({ contest, index }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp); // Convert UNIX timestamp to milliseconds
    return date.toLocaleString(); // Convert to local date-time string
  };
  const handleRegisterClick = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div className="fullcard">
      <button
        className="contestname"
        onClick={() => handleRegisterClick(`https://atcoder.jp/contests/${contest.contestType}${contest.contestCode}`)}
      >
        <h1>{contest.name}</h1>
      </button>
      <div className="individualcontest">
        <h2>Start : {formatDate(contest.startTime)}</h2>
      </div>
      <div className="individualcontest">
        <h2>Duration : {contest.duration}</h2>
      </div>
    </div>
  );
};
export default Contestcardatcoder;
