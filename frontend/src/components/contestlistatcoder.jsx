import React from "react";
import Contestcardatcoder from "./contestcardatcoder.jsx";
import "../compcss/contestlist.css";
const Contestlistatcoder = ({ contests,category }) => {
  // console.log(contests);
  return (
    <div className="contestlist">
      <h1 className="categoryname">{category}</h1>
      
      {contests?.map(contest => (
        <Contestcardatcoder key={contest.id} contest={contest} />
      ))}
    </div>
  );
};
export default Contestlistatcoder;
