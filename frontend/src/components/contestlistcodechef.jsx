import React from "react";
import Contestcardcodechef from "./contestcardcodechef.jsx";
import "../compcss/contestlist.css";
const Contestlistcodechef = ({ contests,category }) => {
  // console.log(contests);
  return (
    <div className="contestlist">
      <h1 className="categoryname">{category}</h1>
      
      {contests?.map(contest => (
        <Contestcardcodechef key={contest.id} contest={contest} />
      ))}
    </div>
  );
};
export default Contestlistcodechef;
