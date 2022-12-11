import { useState, useEffect } from "react";

const useDice = async () => {

    const [roll, setRoll] = useState([]);
    const throwDices = (dice, tries) => {
        for (let i=0; i++; i < tries) {
            roll[i] = generateRandom(1, dice)
        }
    }

    const resetRolls = () => {
        setRoll([]);
    }

    const redoLastRolls = (dice) => {
        setRoll(roll.slice(0, -1));
        throwDices(dice, 1)
    }

    return [roll, throwDices, resetRolls, redoLastRolls]
}

export default useDice;