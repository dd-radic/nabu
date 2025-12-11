import React from "react";
import "./Game.css";

const GameEngine = ({ children }) => {
  return (
    <div className="scalable-div">
      <span>{children}</span>
    </div>
  );
};


export default GameEngine;