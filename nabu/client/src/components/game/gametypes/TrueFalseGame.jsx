import React from "react";
import Game_MultipleChoice from "./MultipleChoiceGame";

const Game_TrueFalse = ({question}) => {
    switch(question.options[0]){
        case "True": question.options[1] = "False" ;break;
        case "False": question.options[1] = "True" ;break;
        default: question.options[1] = "error"; 
    }
    return (
        <Game_MultipleChoice question={question}/>
    );
};


export default Game_TrueFalse;
