import React from "react";
import "../Game.css";
import MultipleChoiceGame from "./MultipleChoiceGame";
import TrueFalseGame from "./TrueFalseGame";
import OrderGame from "./OrderGame";

const Game = ({question}) => {
    switch (question.type){
        case "multiplechoice": return <MultipleChoiceGame question={question}/>
        case "truefalse": return <TrueFalseGame question={question}/>
        case "order": return <OrderGame question={question}/>
        default: return <p>[{question.type}] to default , select a valid game type</p>;
    }
};


export default Game;