var response = [];
var h;
var eatArray = ["beef", "pork"];
var maxHealth = 10;

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

//figures out whether or not an objective has been completed or not and deals with it
function objectiveComplete(placeName, completedObjectives) {
    var done = false;
    for (h = 0; h < completedObjectives.length; h++) {
        if (placeName === completedObjectives[h]) {
            respond("I've already done that here!");
            done = true;
        }
    }
    if (!done) {
        completedObjectives.push(placeName);
    }
    return completedObjectives;
}

function talkTo(args, currentLocation, locationList, sentencesList) {
    for (i = 0; i < locationList.length; i++) {
        if (locationList[i].talkPerson !== null && locationList[i].name === currentLocation) {
            for (k = 0; k < args.length; k++) {
                if (args[k] === locationList[i].talkPerson) {
                    for (j = 0; j < sentencesList.length; j++) {
                        if (locationList[i].talkPerson === sentencesList[j].name) {
                            //capitalizes the name of the person who is talking and adds their intro
                            return sentencesList[j].name.charAt(0).toUpperCase() + sentencesList[j].name.slice(1) + ": " + sentencesList[j].intro;
                        }
                    }
                }
            }
        }
    }
}

function dropItem(inventory, args) {
    for (i = 0; i < args.length; i++) {
        for (j = 0; j < inventory.length; j++) {
            if (args[i] === inventory[j]) {
                inventory.splice(j,1);
                respond("You dropped your " + args[i] + ".");
                return inventory;
            }
        }
    }
    respond("You can't drop what you don't have.");
    return inventory;
}

function getInventory(inventory) {
    if (inventory.length === 0) {
        respond("Your inventory is empty.");
    } else {
        respond("Your inventory contains:");
        for (i = 0; i < inventory.length - 1; i++) {
            if (inventory.length >= 3 && i === inventory.length - 2) {
                respond(inventory[i] + ", and");
            } else if (inventory.length === 2 && i === inventory.length - 2) {
                respond(inventory[i] + " and");
            } else {
                respond(inventory[i] + ",");
            }
        }
        respond(inventory[inventory.length - 1] + ".");
    }
}

function look(located, difficulty) {
    if (!located && difficulty === "hard") {
        respond("There's nothing around.")
    } else {
        respond("");
    }
}

function playAgain(cmd) {
    if (cmd !== "yes") {
        return ("Would you like play again?")
    }
}

//deals with eating
function eat(args, inventory, health) {
    for (i = 0; i < args.length; i++) {
        if (eatArray.includes(args[i])) {
            for (j = 0; j < inventory.length; j++) {
                if (args[i] === inventory[j]) {
                    if (health < maxHealth) {
                        inventory.splice(j, 1);
                        health++;
                        respond("You ate your " + args[i] + ".");
                        return '';
                    } else {
                        respond("You are at your maximum health already.");
                        return '';
                    }
                }
            }
        }
    }
}