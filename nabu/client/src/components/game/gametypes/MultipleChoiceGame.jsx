import React from "react";
import Button from "../../Button";

const Game_MultipleChoice = ({question}) => {
    
    // https://www.geeksforgeeks.org/javascript/how-to-shuffle-the-elements-of-an-array-in-javascript/
    function shuffleArray(arr) {
  	arr.sort(function (a, b) {
    	return Math.random() - 0.5;
  	});
    }

    let questionArr = question.options.slice();
    shuffleArray(questionArr);

    const handleClick = (selectedAnswer) => {
        if (selectedAnswer === question.options[0]) {
            question.isCorrect = true;
        } else {
            question.isCorrect = false;
        }
    };

    return  (
        <div>
            <h2>{question.text}</h2>
            {questionArr.map((option, index) => (
                <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleClick(option)}
                    style={{ width: "100%", marginBottom: "10px" }}
                >
                    {option}
                </Button>
            ))}

        </div>
    )
};


export default Game_MultipleChoice;