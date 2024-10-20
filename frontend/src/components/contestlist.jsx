import React from "react";
import Contestcard from "./contestcard.jsx";
import "../compcss/contestlist.css";
const Contestlist = ({ contests, category }) => {
  // console.log(contests);
  return (
    <div className="contestlist">
      <h1 className="categoryname">{category}</h1>
      {contests?.map((contest, index) => (
        <Contestcard contest={contest} index={index} />
      ))}
    </div>
  );
};
export default Contestlist;
