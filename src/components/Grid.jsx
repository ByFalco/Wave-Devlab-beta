import React from "react";
import "../styles/Grid.css";

const Grid = () => {
  return (
    <div className="grid-container">
      <div className="grid-line horizontal-line"></div>
      <div className="grid-line horizontal-line"></div>
      <div className="grid-line vertical-line"></div>
      <div className="grid-line vertical-line"></div>
    </div>
  );
};

export default Grid;
