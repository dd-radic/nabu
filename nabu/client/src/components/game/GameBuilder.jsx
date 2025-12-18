import React, { useState } from "react";
import "./Game.css";
import Game from "./gametypes/Game.jsx";

const GameEngine = ({ children, question}) => {
    return (
        <div>
            <div className="scalable-div">
                <Game question={question}/>
            </div>
        </div>
    );
};


export default GameEngine;