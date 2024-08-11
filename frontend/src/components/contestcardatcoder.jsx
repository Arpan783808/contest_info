import React from "react";
import "../compcss/contestcard.css";
export const Contestcardatcoder = ({ contest }) => {
  const handleRegisterClick = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div className="fullcard">
      <div className="contestname">
        <h1>{contest.startTime}</h1>
      </div>
      <div className="individualcontest">
        <h2>Start : {contest.title}</h2>
        <h2>Duration : {contest.duration}</h2>
        {/* <button
          className="contestbutton"
          onClick={() => handleRegisterClick(contest.url)}
        >
          Contest
        </button> */}
      </div>
    </div>
  );
};
export default Contestcardatcoder;
