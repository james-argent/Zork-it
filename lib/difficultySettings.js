function getMaxTurns(difficulty) {
    var maxTurns = -1;
    if (difficulty === "easy") {
        maxTurns = 200;
    } else if (difficulty === "hard") {
        maxTurns = 52;
    }
    return maxTurns
}

function changeAttackChance(difficulty) {
    var attackChance = -1;
    if (difficulty === "easy") {
        attackChance = 15;
    }
    if (difficulty === "hard") {
        attackChance = 25;
    }
    return attackChance
}

function setDifficulty (cmd) {
    var chosenDifficulty = cmd;
    if (chosenDifficulty === "easy") {
        respond("Easy difficulty selected.");
    } else if (chosenDifficulty === "hard") {
        respond("Hard difficulty selected.");
    } else if (chosenDifficulty === "medium") {
        respond("Medium difficulty selected.");
    } else {
        respond("Medium difficulty selected by default.");
        chosenDifficulty = "medium";
    }
    return chosenDifficulty
}