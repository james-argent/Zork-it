var moveArray = ["north", "east", "south", "west"];
var i, j, k, h;
var locationList = null, sentencesList = null;
var maxInventory = 7;
var maxDistance = 6;
var gameState = setInitialGameState();
var located = true;

function restartGame() {
    gameState = setInitialGameState();
    updateHealthBar(gameState.health);
    return("Game restarted. What difficulty would you like? Easy, Medium or Hard?");
}

var terminal = new Terminal('terminal', {welcome: 'Welcome to a Song of Zork and Fire. What difficulty would you like? Easy, Medium or Hard?'}, {
    execute: function (cmd, args) {

        //Make the input all lower case
        cmd = cmd.toLowerCase();
        for (i = 0; i < args.length; i++)
          args[i] = args[i].toLowerCase();

        clearResponse();

        var done = false;

        //if the player says anything other than yes
        if (gameState.overtime >= 1) {
            playAgain(cmd);
        }

        //deals with restarting the game if the player desires to
        if (gameState.restartQueried) {
            gameState.restartQueried = false;
            if (cmd === "yes") {
                return (restartGame());
            }
        }
        if (cmd === "restart") {
            gameState.restartQueried = true;
            return ("Are you sure you'd like to restart?");
        }

        //closes the tab if the user no longer wishes to play
        if (gameState.quitQueried) {
            gameState.quitQueried = false;
            if (cmd === "yes") {
                window.close();
            }
        }
        if (cmd === "quit") {
            gameState.quitQueried = true;
            return ("Are you sure you'd like to quit?");
        }

        //restarts the game if the player finished their game and wishes to restart
        if (gameState.gameEnded && cmd === "yes") {
            hideMessage();
            respond("Great!");
            return(restartGame());
        }

        //set the difficulty
        if (gameState.elapsedTime === 0) {
            gameState.difficulty = setDifficulty(cmd);
            if (cmd === "easy" || cmd === "hard") {
                gameState.maxTurns = getMaxTurns(cmd);
                gameState.attackChance = changeAttackChance(cmd, gameState.attackChance);
            }
        }

        //inventory check command. Extensive code to ensure the grammar is correct.
        if (cmd === "inventory") {
            getInventory(gameState.inventory);
        }

        var given = false;
        if (cmd === "give") {
            for (k = 0; k < args.length; k++) {
                if (args[k] === "dragonglass") {
                    for (i = 0; i < locationList.length; i++) {
                        if (locationList[i].winCon && locationList[i].name === gameState.currentLocationName) {
                            for (j = 0; j < gameState.inventory.length; j++) {
                                if (gameState.inventory[j] === "dragonglass") {
                                    objectiveComplete(gameState.currentLocationName, gameState.completedObjectives);
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
            gameState.gameEnded = endGame("won");
        }

        if (cmd === "talk") {
            respond(talkTo(args, gameState.currentLocationName, locationList, sentencesList));
        }

        //allows the user to remove items from their inventory
        if (cmd === "drop") {
            gameState.inventory = dropItem(gameState.inventory, args);
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

        //tells the user their situation
        if (cmd === "look") {
            look(located, gameState.difficulty);
        }

        //health check
        if (cmd === "health" || cmd === "life") {
            healthCheck(gameState.health);
        }

        if (cmd === "eat") {
            gameState.health = eat(args, gameState.inventory, gameState.health);
            healthCheck(gameState.health);
        }

        //deals with taking items
        if (cmd === "take") {
            gameState.inventory = takeItem(gameState.inventory, locationList, args, maxInventory, gameState.currentLocationName);
        }

        //function that deals with movement
        function move(args) {
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
                                healthCheck(gameState.health);
                            }
                        }
                    }
                }
            }
        }
        if ((cmd === "move") || (cmd === "go") || (cmd === "walk")) {
            move(args);
        }

        //ends the game if the player reaches 0 life
        if (gameState.health < 1) {
            respond("You died due to lack of health!");
            updateHealthBar(0);
            gameState.gameEnded = endGame("lost");
        }

        //ends the game if the player runs out of time
        if (gameState.elapsedTime > gameState.maxTurns) {
            respond("You lost due to running out of time!");
            gameState.gameEnded = endGame("lost");
        }

        //catch-all which covers unknown commands POSITIONING MATTERS
        if (responseLength() === 0 || responseLength() === 1 && response[0].includes("Medium difficulty selected by default.")) {
            respond("You can't do that.");
        }

        //kill the user if they go too far from the objectives
        if (Math.abs(gameState.currentCoordinates.x) + Math.abs(gameState.currentCoordinates.y) >= maxDistance) {
            respond("You have gone too far from the Wall and have been executed for being a deserter.");
            updateHealthBar(0);
            gameState.gameEnded = endGame("lost");
        }
        if (Math.abs(gameState.currentCoordinates.x) + Math.abs(gameState.currentCoordinates.y) === maxDistance - 1) {
            respond("Careful! If you go any further from the wall you will be executed.");
        }

        //tells the user where they are
        gameState.currentLocationName = locateUser(gameState.difficulty, locationList, gameState.currentCoordinates.x, gameState.currentCoordinates.y, gameState.gameEnded);

        //heals the player if they're in a safe place
        gameState.health = safePlaceHeal(gameState.health, gameState.currentLocationName, locationList, maxHealth);

        //adjust health display to reflect in-game health
        if (gameState.displayedHealth !== gameState.health) {
            updateHealthBar(gameState.health);
            gameState.displayedHealth = gameState.health;
        }

        //adds 1 turn to the turn count
        gameState.elapsedTime++;
        
        if (gameState.gameEnded) {
            gameState.overtime += 1;
            return getResponse() + " Would you like play again?";
        } else {
            return getResponse();
        }
    }
});