import React from "react";
import "../Game.css";
import MultipleChoiceGame from "./MultipleChoiceGame";
import TrueFalseGame from "./TrueFalseGame";
import OrderGame from "./OrderGame";

const Game = ({question}) => {
    switch (question.Type){
        case "multiplechoice": return <MultipleChoiceGame/>
        case "truefalse": return <TrueFalseGame/>
        case "order": return <OrderGame/>
        default: return <p>[{question.Type}] to default , select a valid game type</p>;
    }
};


export default Game;