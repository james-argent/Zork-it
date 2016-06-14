var moveArray = ["north", "east", "south", "west"];
var eatArray = ["beef", "pork"];
var i, j, k, h, response, responded;
var locationList = null, sentencesList = null;
var maxInventory = 7;
var easyTurns = 200, maxTurns = 100, hardTurns = 52;
var maxDistance = 6;
var maxHealth = 10;
var gameState = null;
var displayedHealth = 10;
var restartQueried;

var initialState = {
    inventory: ["pork", "beef"],
    currentCoordinates: {x: 0, y: 0},
    difficulty: null,
    currentLocationName: "Castle Black",
    attackChance: 20,
    elapsedTime: 0,
    health: 10,
    completedObjectives: [],
    gameEnded: false,
    overtime: 0
};

var setInitialGameState = function() {
    gameState = JSON.parse(JSON.stringify(initialState));
};
setInitialGameState();

//generic function for writing to the terminal
var respond = function(output) {
    response.push(" " + output);
    responded = true;
};

// TODO consider what to do while loading
httpGetRequest("../lib/locationData.json", function(data){
    locationList = JSON.parse(data);
});

httpGetRequest("../lib/conversations.json", function(data){
    sentencesList = JSON.parse(data);
});

var setDifficulty = function(cmd) {
    if (cmd === "easy") {
        respond("Easy difficulty selected.");
        gameState.difficulty = cmd;
        maxTurns = easyTurns;
        gameState.attackChance -= 5;
    } else if (cmd === "hard") {
        respond("Hard difficulty selected.");
        gameState.difficulty = cmd;
        maxTurns = hardTurns;
        gameState.attackChance += 5;
    } else if (cmd === "medium") {
        respond("Medium difficulty selected.");
        gameState.difficulty = "medium";
    } else {
        respond("Medium difficulty selected by default.");
        gameState.difficulty = "medium";
    }
};

var terminal = new Terminal('terminal', {welcome: 'Welcome to a Song of Zork and Fire. What difficulty would you like? Easy, Medium or Hard?'}, {
    execute: function (cmd, args) {

        //Make the input all lower case
        cmd = cmd.toLowerCase();
        for (i = 0; i < args.length; i++)
          args[i] = args[i].toLowerCase();

        response = [];
        responded = false;
        var fullString = "";

        //generic end game function
        var endGame = function(result) {
            endGameFX(result);
            gameState.gameEnded = true;
        };

        //figures out whether or not an objective has been completed or not and deals with it
        var done = false;
        var objectiveComplete = function() {
            done = false;
            for (h = 0; h < gameState.completedObjectives.length; h++) {
                if (gameState.currentLocationName === gameState.completedObjectives[h]) {
                    respond("I've already done that here!");
                    done = true;
                }
            }
            if (!done) {
                gameState.completedObjectives.push(gameState.currentLocationName);
            }
        };

        //if the player says anything other than yes
        if (gameState.overtime >= 1 && cmd !== "yes") {
            return ("Would you like play again?")
        }

        var restartGame = function() {
            setInitialGameState();
            updateHealthBar(gameState.health);
            return("Game restarted. What difficulty would you like? Easy, Medium or Hard?")
        };

        //deals with restarting the game if the player desires to
        if (restartQueried) {
            restartQueried = false;
            if (cmd === "yes") {
                return(restartGame());
            }
        }
        if (cmd === "restart") {
            restartQueried = true;
            return ("Are you sure you'd like to restart?")
        }

        //restarts the game if the player finished their game and wishes to restart
        if (gameState.gameEnded && cmd === "yes") {
            hideMessage();
            respond("Great!");
            return(restartGame());
        }

        //set the difficulty
        if (gameState.elapsedTime === 0) {
            setDifficulty(cmd);
        }

        //inventory check
        if (cmd === "inventory") {
            if (gameState.inventory.length == 0) {
                respond("Your inventory is empty.");
            } else {
                respond(("Your inventory contains: " + gameState.inventory + "."));
            }
        }

        var given = false;
        if (cmd === "give") {
            for (k = 0; k < args.length; k++) {
                if (args[k] === "dragonglass") {
                    for (i = 0; i < locationList.length; i++) {
                        if (locationList[i].winCon && locationList[i].name === gameState.currentLocationName) {
                            for (j = 0; j < gameState.inventory.length; j++) {
                                if (gameState.inventory[j] === "dragonglass") {
                                    objectiveComplete();
                                    if (!done) {
                                        respond("You handed out some dragonglass.");
                                        gameState.inventory.splice(j,1);
                                        given = true;
                                    }
                                    break;
                                }
                            }
                            if (!given && !done) {
                                respond("Looks like you don't have any dragonglass to give away.");
                            }
                        }
                    }
                }
                //gives the whore to crastor
                if (args[k] === "whore" && gameState.currentLocationName === "Crastor's Keep") {
                    for (i = 0; i < locationList.length; i++) {
                        if (locationList[i].name === "Crastor's Keep") {
                            if (!locationList[i].done) {
                                for (j = 0; j < gameState.inventory.length; j++) {
                                    if (gameState.inventory[j] === "whore") {
                                        gameState.inventory.splice(j, 1);
                                    }
                                }
                                respond("You sold out your honour for some pork.");
                                //make pork available
                                for (i = 0; i < locationList.length; i++) {
                                    if (locationList[i].name === "Crastor's Keep") {
                                        locationList[i].item = "pork";
                                        locationList[i].done = true;
                                    }
                                }
                                //update crastor's message
                                for (h = 0; h < sentencesList.length; h++) {
                                    if (sentencesList[h].name === "crastor") {
                                        sentencesList[h].intro = "I hate you.";
                                    }
                                }
                            } else {
                                respond("You already gave Crastor a whore.");
                            }
                        }
                    }
                }
            }
        }
        //win condition
        if (gameState.completedObjectives.length === 3) {
            endGame("won");
        }

        var conversationWith = function(person) {
            for (j = 0; j < sentencesList.length; j++) {
                if (person === sentencesList[j].name) {
                    return sentencesList[j].name.charAt(0).toUpperCase() + sentencesList[j].name.slice(1) + ": " + sentencesList[j].intro;
                }
            }
        };
        if (cmd === "talk") {
            for (i = 0; i < locationList.length; i++) {
                if (locationList[i].talkPerson !== null && locationList[i].name === gameState.currentLocationName) {
                    for (k = 0; k < args.length; k++) {
                        if (args[k] === locationList[i].talkPerson) {
                            return(conversationWith(locationList[i].talkPerson));
                        }
                    }
                }
            }
        }

        //allows the user to remove items from their inventory
        var dropped = false;
        if (cmd === "drop") {
            for (i = 0; i < args.length; i++) {
                for (j = 0; j < gameState.inventory.length; j++) {
                    if (args[i] === gameState.inventory[j]) {
                        gameState.inventory.splice(j,1);
                        respond("You dropped your " + args[i] + ".");
                        dropped = true;
                        break;
                    }
                }
            }
            if (!dropped) {
                respond("You can't drop what you don't have.");
            }
        }

        //help command
        if (cmd === "help" || cmd === "advice") {
            respond("If you would like some help, just read the readme file.");
        }

        //clears the terminal
        if (cmd === "clear" || cmd === "cls") {
            terminal.clear();
            return '';
        }

        //re-sizes the map without having to click it
        if (cmd === "map") {
            resizeMap();
            respond("");
        }

        //tells the user their situation
        if (cmd === "look") {
            respond("");
        }

        //health check
        var healthCheck = function() {
            (respond("Your current health is: " + gameState.health + "."));
        };
        if (cmd === "health" || cmd === "life") {
            healthCheck();
        }

        //deals with eating
        var eat = function(args) {
            for (i = 0; i < args.length; i++) {
                if (eatArray.includes(args[i])) {
                    for (j = 0; j < gameState.inventory.length; j++) {
                        if (args[i] === gameState.inventory[j]) {
                            gameState.inventory.splice(j,1);
                            if (gameState.health < maxHealth) {
                                gameState.health++;
                                respond("You ate your " + args[i] + ".");
                                eaten = true;
                                healthCheck();
                                return '';
                            } else {
                                respond("You ate your " + args[i] + ". You are at your max health.");
                                eaten = true;
                                return '';
                            }
                        }
                    }
                }
            }
        };
        if (cmd === "eat") {
            var eaten = false;
            eat(args);
        }

        //deals with taking items
        var taken = false;
        if (cmd === "take") {
            for (i = 0; i < locationList.length; i++) {
                if (locationList[i].name === gameState.currentLocationName && locationList[i].item !== null && args.includes(locationList[i].item)) {
                    if (gameState.inventory.length < maxInventory) {
                        gameState.inventory.push(locationList[i].item);
                        respond("You put the " + locationList[i].item + " in your inventory.");
                        taken = true;
                    } else {
                        respond("Your inventory is full already.");
                        taken = true;
                    }
                }
            }
            if (!taken) {
                respond("You can't take that.");
            }
        }

        //function that deals with movement
        var move = function(args) {
            for (i = 0; i < args.length; i++) {
                if (moveArray.includes(args[i])) {
                    var canMove = true;
                    //conducts the movement and makes sure that the player isn't trying to walk into the sea
                    switch(args[i]) {
                        case "north":
                            gameState.currentCoordinates.y++;
                            break;
                        case "east":
                            if (gameState.currentCoordinates.x === 2) {
                                canMove = false;
                                respond("You can't go " + args[i] + "! That's the sea!");
                            } else {
                                gameState.currentCoordinates.x++;
                            }
                            break;
                        case "south":
                            gameState.currentCoordinates.y--;
                            break;
                        case "west":
                            if (gameState.currentCoordinates.x === -2) {
                                canMove = false;
                                respond("You can't go " + args[i] + "! That's the sea!");
                            } else {
                                gameState.currentCoordinates.x--;
                            }
                            break;
                    }
                    //once verified that the player can and has moved, they might be attacked
                    if (canMove) {
                        respond(" You went " + args[i] + ".");
                        if (gameState.currentCoordinates.y > 0) {
                            var attacked = Math.floor((Math.random() * 100) + 1);
                            if (attacked <= gameState.attackChance) {
                                respond("You were attacked by wights but you managed to escape.");
                                gameState.health -= 2;
                                healthCheck();
                            }
                        }
                    }
                }
            }
        };
        if ((cmd === "move") || (cmd === "go")) {
            move(args);
        }

        //ends the game if the player reaches 0 life
        if (gameState.health < 1) {
            respond("You died due to lack of health!");
            updateHealthBar(0);
            endGame("lost");
        }

        //ends the game if the player runs out of time
        if (gameState.elapsedTime > maxTurns) {
            respond("You lost due to running out of time!");
            endGame("lost");
        }

        //catch-all which covers unknown commands
        if (!responded) {
            respond("You can't do that.");
        }

        //kill the user if they go too far from the objectives
        if (Math.abs(gameState.currentCoordinates.x) + Math.abs(gameState.currentCoordinates.y) >= maxDistance) {
            respond("You have gone too far from the Wall and have been executed for being a deserter.");
            updateHealthBar(0);
            endGame("lost");
        }
        if (Math.abs(gameState.currentCoordinates.x) + Math.abs(gameState.currentCoordinates.y) === maxDistance - 1) {
            respond("Careful! If you go any further from the wall you will be executed.");
        }

        //tells the user where they are
        var located = false;
        for (i = 0; i < locationList.length; i++) {
            if ((gameState.currentCoordinates.x === locationList[i].x) && (gameState.currentCoordinates.y === locationList[i].y))
            {
                respond("You are at " + locationList[i].name + ". " + locationList[i].comment);
                located = true;
                gameState.currentLocationName = locationList[i].name;
                //section to hint to 'easy' players that they're repeatedly going to useless locations
                if (locationList[i].visitCount === undefined) {
                    locationList[i].visitCount = 1;
                } else {
                    locationList[i].visitCount += 1;
                }
                if (locationList[i].visitCount >= 5 && gameState.difficulty === "easy") {
                    if (locationList[i].winCon !== true && locationList[i].safeZone !== true && locationList[i].talkPerson === undefined && locationList[i].item === undefined) {
                        respond("There's really no reason to be here.")
                    }
                }
            }
        }
        if (!located && gameState.difficulty !== "hard") {
            if (!gameState.gameEnded) {
                respond("This place doesn't have a name. Your coordinates are (" + gameState.currentCoordinates.x + "," + gameState.currentCoordinates.y + ").");
                gameState.currentLocationName = null;
            }
        }

        //heals the player if they're in a safe place
        if (gameState.health < 10) {
            for (i = 0; i < locationList.length; i++) {
                if (gameState.currentLocationName === locationList[i].name && locationList[i].safeZone) {
                    gameState.health = maxHealth;
                    respond("You were healed back up to full health by your brothers of the Night's Watch.");
                }
            }
        }

        //adjust health display to reflect in-game health
        if (displayedHealth !== gameState.health) {
            updateHealthBar(gameState.health);
            displayedHealth = gameState.health;
        }

        //adds 1 turn to the turn count
        gameState.elapsedTime++;

        //formats the response for the terminal
        for (i = 0; i < response.length; i++) {
            fullString += response[i];
        }
        if (gameState.gameEnded) {
            gameState.overtime += 1;
            return fullString + " Would you like play again?";
        } else {
            return fullString;
        }
    }
});