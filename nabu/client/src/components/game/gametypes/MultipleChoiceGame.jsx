import React from "react";

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
        alert(selectedAnswer + " " + question.options[0]);
        if (selectedAnswer === question.options[0]) {
            question.isCorrect = true;
        } else {
            question.isCorrect = false;
        }
    };

    return (
        <div>
            <h2>{question.text}</h2>
            {questionArr.map((option, index) => (
                <div>
                <button key={index} onClick={() => handleClick(option)}>
                    <h3>{option}</h3>
                </button>
                <br/><br/>
                </div>
            ))}
        </div>
    );
};


export default Game_MultipleChoice;