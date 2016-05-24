var inventory = ["pork", "beef"];
var moveArray = ["north", "east", "south", "west"];
var eatArray = ["beef", "pork"];
var currentCoordinates = {x:0,y:0};
var i, j, k, h, difficulty, currentLocationName, lose;
var attackChance = 15;
var elapsedTime = 0;
var health = 10;
var maxInventory = 7;
var easyTurns = 200, maxTurns = 100, hardTurns = 52;
var maxDistance = 6;
var maxHealth = 10;
var completedObjectives = [];
var response, responded;
var locationList = null;

//generic function for writing to the terminal
var respond = function(output) {
    response.push(" " + output);
    responded = true;
};

// TODO consider what to do while loading
httpGetRequest("../lib/locationData.json", function(data){
    locationList = JSON.parse(data);
});

var setDifficulty = function(cmd) {
    if (cmd === "easy") {
        respond("Easy difficulty selected.");
        difficulty = cmd;
        maxTurns = easyTurns;
        attackChance -= 5
    } else if (cmd === "hard") {
        respond("Hard difficulty selected.");
        difficulty = cmd;
        maxTurns = hardTurns;
        attackChance += 5
    } else if (cmd === "medium") {
        respond("Medium difficulty selected.");
        difficulty = "medium";
    } else {
        respond("Medium difficulty selected by default.");
        difficulty = "medium";
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
            endGameFX(result)
        };

        //figures out whether or not an objective has been completed or not and deals with it
        var done = false;
        var objectiveComplete = function(currentLocationName) {
            done = false;
            for (h = 0; h < completedObjectives.length; h++) {
                if (currentLocationName === completedObjectives[h]) {
                    respond("I've already done that here!");
                    done = true
                }
            }
            if (done === false) {
                completedObjectives.push(currentLocationName);
            }
        };

        //set the difficulty
        if (elapsedTime === 0) {
            setDifficulty(cmd)
        }

        //inventory check
        if (cmd === "inventory") {
            if (inventory.length == 0) {
                respond("Your inventory is empty.")
            } else {
                respond(("Your inventory contains: " + inventory + "."))
            }
        }

        var given = false;
        if (cmd === "give") {
            for (k = 0; k < args.length; k++) {
                if (args[k] === "dragonglass") {
                    for (i = 0; i < locationList.length; i++) {
                        if (locationList[i].winCon === true && locationList[i].name === currentLocationName) {
                            for (j = 0; j < inventory.length; j++) {
                                if (inventory[j] === "dragonglass") {
                                    objectiveComplete(currentLocationName);
                                    if (done === false) {
                                        respond("You handed out some dragonglass.");
                                        inventory.splice(j,1);
                                        given = true;
                                    }
                                    break;
                                }
                            }
                            if (given === false && done === false) {
                                respond("Looks like you don't have any dragonglass to give away.")
                            }
                        }
                    }
                }
            }
        }
        //win condition
        if (completedObjectives.length === 3) {
            endGame("won")
        }

        //allows the user to remove items from their inventory
        var dropped = false;
        if (cmd === "drop") {
            for (i = 0; i < args.length; i++) {
                for (j = 0; j < inventory.length; j++) {
                    if (args[i] === inventory[j]) {
                        inventory.splice(j,1);
                        respond("You dropped your " + args[i] + ".");
                        dropped = true;
                        break
                    }
                }
            }
            if (dropped === false) {
                respond("You can't drop what you don't have.")
            }
        }

        //help command
        if (cmd === "help") {
            respond("If you would like some help, just read the readme file.")
        }

        //clears the terminal
        if (cmd === "clear" || cmd === "cls") {
            terminal.clear();
            return '';
        }

        //tells the user their situation
        if (cmd === "look") {
            respond("")
        }

        //health check
        var healthCheck = function() {
            (respond("Your current health is: " + health + "."))
        };
        if (cmd === "health") {
            healthCheck();
        }

        //deals with eating
        var eat = function(args) {
            for (i = 0; i < args.length; i++) {
                if (eatArray.includes(args[i])) {
                    for (j = 0; j < inventory.length; j++) {
                        if (args[i] === inventory[j]) {
                            inventory.splice(j,1);
                            if (health < maxHealth) {
                                health++;
                                respond("You ate your " + args[i] + ".");
                                eaten = true;
                                healthCheck();
                                return ''
                            } else {
                                respond("You ate your " + args[i] + ". You are at your max health.");
                                eaten = true;
                                return ''
                            }
                        }
                    }
                }
            }
        };
        if (cmd === "eat") {
            var eaten = false;
            eat(args);
            if (eaten === false) {
                respond("You can't do that.")
            }
        }

        //deals with taking items
        var taken = false;
        if (cmd === "take") {
            for (i = 0; i < locationList.length; i++) {
                if (locationList[i].name === currentLocationName && locationList[i].item !== null && args.includes(locationList[i].item)) {
                    if (inventory.length < maxInventory) {
                        inventory.push(locationList[i].item);
                        respond("You put the " + locationList[i].item + " in your inventory.");
                        taken = true
                    } else {
                        respond("Your inventory is full already.");
                        taken = true
                    }
                }
            }
            if (taken === false) {
                respond("You can't take that.")
            }
        }

        //ends the game if the character meets any of the losing criteria
        if (health < 1 || elapsedTime > maxTurns) {
            endGame("lose");
        }

        //function that deals with movement
        var move = function(args) {
            for (i = 0; i < args.length; i++) {
                if (moveArray.includes(args[i])) {
                    var canMove = true;
                    //conducts the movement and makes sure that the player isn't trying to walk into the sea
                    switch(args[i]) {
                        case "north":
                            currentCoordinates.y++;
                            break;
                        case "east":
                            if (currentCoordinates.x === 2) {
                                canMove = false;
                                respond("You can't go " + args[i] + "! That's the sea!")
                            } else {
                                currentCoordinates.x++;
                            }
                            break;
                        case "south":
                            currentCoordinates.y--;
                            break;
                        case "west":
                            if (currentCoordinates.x === -2) {
                                canMove = false;
                                respond("You can't go " + args[i] + "! That's the sea!")
                            } else {
                                currentCoordinates.x--;
                            }
                            break;
                    }
                    //once verified that the player can and has moved, they might be attacked
                    if (canMove === true) {
                        respond(" You went " + args[i] + ".");
                        if (currentCoordinates.y > 0) {
                            var attacked = Math.floor((Math.random() * 100) + 1);
                            if (attacked <= attackChance) {
                                respond("You were attacked by wights but you managed to escape.");
                                health -= 2;
                                healthCheck();
                            }
                        }
                    }
                }
            }
        };
        if ((cmd === "move") || (cmd === "go")) {
            move(args)
        }

        //catch-all which covers unknown commands
        if (responded === false) {
            respond("I don't know what you mean.")
        }

        //kill the user if they go too far from the objectives
        if (Math.abs(currentCoordinates.x) + Math.abs(currentCoordinates.y) >= maxDistance) {
            respond("You have gone too far from the Wall and have been executed for being a traitor.");
            endGame("lose");
        }
        if (Math.abs(currentCoordinates.x) + Math.abs(currentCoordinates.y) === maxDistance - 1) {
            respond("Careful! If you go any further from the wall you will be executed.")
        }

        //tells the user where they are
        var located = false;
        for (i = 0; i < locationList.length; i++) {
            if ((currentCoordinates.x === locationList[i].x) && (currentCoordinates.y === locationList[i].y))
            {
                respond("You are at " + locationList[i].name + ". " + locationList[i].comment);
                located = true;
                currentLocationName = locationList[i].name
            }
        }
        if (located === false && difficulty !== "hard") {
            respond("This place doesn't have a name. Your coordinates are (" + currentCoordinates.x + "," + currentCoordinates.y + ").");
            currentLocationName = null
        }

        //adds 1 turn to the turn count
        elapsedTime++;

        //formats the response for the terminal
        for (i = 0; i < response.length; i++) {
            fullString += response[i];
        }
        return fullString;
    }
});