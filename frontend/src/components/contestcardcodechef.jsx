import React from "react";
import "../compcss/contestcard.css";
export const Contestcardcodechef = ({ contest, index }) => {
  const handleRegisterClick = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div className="fullcard">
      <button
        className="contestname"
        onClick={() =>
          handleRegisterClick(
            `https://www.codechef.com/${contest.contestType}${contest.contestCode}`
          )
        }
      >
        <h1>{contest.name}</h1>
      </button>
      {!contest.isPast && <div className="individualcontest">
          <h2>Starts in:{contest.startTime}</h2>
        </div>}
      <div className="individualcontest">
        <h2>Duration : 90 min</h2>
      </div>
    </div>
  );
};
export default Contestcardcodechef;
