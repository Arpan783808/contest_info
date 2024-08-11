import React from "react";
import Contestcard from "./contestcard.jsx";
import "../compcss/contestlist.css";
const Contestlist = ({ contests,category }) => {
  // console.log(contests);
  return (
    <div className="contestlist">
      <h1 className="categoryname">{category}</h1>
      
      {contests?.map(contest => (
        <Contestcard contest={contest} />
      ))}
    </div>
  );
};
export default Contestlist;
