import React, { useState } from "react";
import "./Game.css";
import Game from "./gametypes/Game.jsx";

const GameEngine = ({ question }) => {
  const [locked, setLocked] = useState(false);

  return (
    <div>
      {/* Capture first click anywhere inside 
          Lock user upon first click
          Should be changed to lock when the boolean is returned
      */}
      <div
        className={`scalable-div ${locked ? "locked" : ""}`}
        onClickCapture={() => {
          if (!locked) setLocked(true);
        }}
      >
        <Game question={question} />
      </div>
    </div>
  );
};

export default GameEngine;
