import React, { useMemo } from "react";
import Button from "../../Button";

const Game_MultipleChoice = ({ question }) => {

  const shuffledOptions = useMemo(() => {
    const arr = [...question.options];
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }, [question]); // reshuffle ONLY when question changes

  const handleClick = (selectedAnswer) => {
    question.isCorrect = selectedAnswer === question.options[0];
  };

  return (
    <div>
      <h2>{question.text}</h2>

      <div className="button-panel">
        {shuffledOptions.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => handleClick(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Game_MultipleChoice;
