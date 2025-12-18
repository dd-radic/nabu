import React from "react";
import GameEngine from "../components/game/GameBuilder";
import Game from "../components/game/gametypes/Game";

const GameTest = () => {

    return (
        <GameEngine>
            <Game></Game>
        </GameEngine>
    );
}

export default GameTest;