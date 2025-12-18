import React, { useState } from "react";
import "./Game.css";

const GameEngine = ({ children }) => {
    const [isCorrect, setIsCorrect] = useState("");
    
    return (
        <div>
            <div className="scalable-div">
                <span>{children}</span>
                    <button onClick={()=>{
                        setIsCorrect(true);
                    }}>
                    Click me
                    </button>
            </div>
            {String(isCorrect)}
        </div>
    );
};


export default GameEngine;