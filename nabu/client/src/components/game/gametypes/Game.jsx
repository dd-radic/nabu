import React from "react";
import "./Game.css";
import MultipleChoiceGame from "./MultipleChoiceGame";
import TrueFalseGame from "./TrueFalseGame";
import OrderGame from "./OrderGame";

const Game = (type) => {
    switch (type){
        case "multiplechoice": return <MultipleChoiceGame/>
        case "truefalse": return <TrueFalseGame/>
        case "order": return <OrderGame/>
        default: return;
    }
};


export default Game;