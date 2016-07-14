var response = [];

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

//generic function for writing to the terminal
function respond(output) {
    return response.push(" " + output);
}

function clearResponse() {
    return response = [];
}

function responseLength() {
    return response.length;
}

function getResponse() {
    var fullString = "";
    //formats the response for the terminal
    for (i = 0; i < response.length; i++) {
        fullString += response[i];
    }
    return fullString;
}

function setInitialGameState() {
    var initialState = {
        displayedHealth: 10,
        inventory: ["pork", "beef"],
        currentCoordinates: {x: 0, y: 0},
        difficulty: null,
        currentLocationName: null,
        attackChance: 20,
        elapsedTime: 0,
        health: 10,
        completedObjectives: [],
        gameEnded: false,
        overtime: 0,
        restartQueried: false,
        quitQueried: false,
        maxTurns: 100
    };
    //no tests for getRequests atm
    getRequests();
    return JSON.parse(JSON.stringify(initialState));
}

function healthCheck(health) {
    respond("Your current health is: " + health + ".");
}