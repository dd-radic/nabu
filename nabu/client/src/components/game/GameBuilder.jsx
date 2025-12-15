import React from "react";
import "./Game.css";

const GameEngine = ({ children }) => {
    return (
        <div>
            <div className="scalable-div">
                <span>{children}</span>
            </div>
        </div>
    );
};


export default GameEngine;