var inventory = ["pork", "beef"];
var moveArray = ["north", "east", "south", "west"];
var eatArray = ["beef", "pork"];
var currentCoordinates = {x:0,y:0};
var i, j, k, h, difficulty, currentLocationName;
var attackChance = 15;
var elapsedTime = 0;
var health = 10;
var maxInventory = 7;
var easyTurns = 200, maxTurns = 100, hardTurns = 52;
var maxDistance = 6;
var maxHealth = 10;
var completedObjectives = [];

var terminal = new Terminal('terminal', {}, {
    execute: function (cmd, args) {

        //Make the input all lower case
        cmd = cmd.toLowerCase();
        for (i = 0; i < args.length; i++)
          args[i] = args[i].toLowerCase();

        var response = [];
        var responded = false;

        //generic function for writing to the terminal
        var respond = function(output) {
            response.push(" " + output);
            responded = true;
        };

        //generic end game function
        var endGame = function() {
            respond("YOU LOSE.")
        };

        //figures out whether or not an objective has been completed or not and deals with it
        var doneAlready = false;
        var objectiveComplete = function(currentLocationName) {
            doneAlready = false;
            for (h = 0; h < completedObjectives.length; h++) {
                if (currentLocationName === completedObjectives[h]) {
                    respond("I've already done that here!");
                    doneAlready = true
                }
            }
            if (doneAlready === false) {
                completedObjectives.push(currentLocationName);
            }
        };

        //set the difficulty
        if (elapsedTime === 0) {
            if (cmd === "easy") {
                respond(cmd + " difficulty selected.");
                difficulty = cmd;
                maxTurns = easyTurns;
                attackChance -= 5
            } else if (cmd === "hard") {
                respond(cmd + " difficulty selected.");
                difficulty = cmd;
                maxTurns = hardTurns;
                attackChance += 5
            } else {
                respond("Medium difficulty selected.");
                difficulty = "medium";
            }
        }

        var location1 = {x: 0, y: 0, name: "Castle Black", comment: "You feel at home here but Ser Alliser Thorne always seems to be plotting something...", winCon: true};
        var location2 = {x: 2, y: 0, name: "Eastwatch-by-the-Sea", comment: "One of the only manned castles along the wall. The castle furthest East.", winCon: true};
        var location3 = {x: -2, y: 0, name: "Shadow Tower", comment: "One of the three remaining manned castles along the wall.", winCon: true};
        var location4 = {x: -1, y: 2, name: "Crastor's Keep", comment: "Keep your hands off of his daughter wives or he'll kill you. There's some tasty pork roasting over the fire.", item: "pork"};
        var location5 = {x: -2, y: 3, name: "The Fist of the First Men", comment: "A big battle happened here. There is a pile of dragonglass...", item: "dragonglass"};
        var location6 = {x: 2, y: 3, name: "Hardhome", comment: "The wildings have a settlement here. Best not disturb them."};
        var location7 = {x: 0, y: -1, name: "Moletown", comment: "Known for its brothel."};
        var location8 = {x: 0, y: -4, name: "Winterfell", comment: "My old home. The north remembers."};
        var location9 = {x: 2, y: -3, name: "The Dreadfort", comment: "The seat of the traitorous House Bolton."};
        var location10 = {x: -1, y: 0, name: "Icemark", comment: "An abandoned castle along the wall. There's no-one here."};
        var location11 = {x: 1, y: 0, name: "Rimegate", comment: "An abandoned castle along the wall. There's no-one here."};
        var location12 = {x: -1, y: -1, name: "Queen's Crown", comment: "An abandoned holdfast and village."};
        var location13 = {x: 2, y: -3, name: "Karhold", comment: "A strong northern castle and the seat of House Karstark."};
        var location14 = {x: 1, y: -2, name: "Last Hearth", comment: "The castle that belongs the Umbers. They've always been loyal to House Stark..."};
        var location15 = {x: 0, y: 1, name: "Whitetree", comment:"A small abandoned wildling village."};
        var locationList = [location1, location2, location3, location4, location5, location6, location7, location8, location9, location10, location11, location12, location13, location14, location15];

        //inventory check
        if (cmd === "inventory") {
            inventoryExpanded = [];
            if (inventory.length == 0) {
                respond("Your inventory is empty.")
            } else {
                //create the inventory minus the last item to solve syntax issues
                for (i = 0; i < inventory.length - 1; i++) {
                    inventoryExpanded.push(inventory[i] + "/")
                }
                //add the last item and print it
                respond("Your inventory contains: " + inventoryExpanded + inventory[inventory.length - 1] + ".")
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
                                    if (doneAlready === false) {
                                        respond("You handed out some dragonglass.");
                                        inventory.splice(j,1);
                                        given = true;
                                    }
                                    break;
                                }
                            }
                            if (given === false && doneAlready === false) {
                                respond("Looks like you don't have any dragonglass to give away.")
                            }
                        }
                    }
                }
            }
        }
        //win condition
        if (completedObjectives.length === 3) {
            respond("You prepared for the whitewalkers attack! You win!")
        }

        var dropped = false;
        //allows the user to remove items from their inventory
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
            endGame();
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
            endGame();
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
            respond("This place doesn't have a name. Your coordinates are (" + currentCoordinates.x + "/" + currentCoordinates.y + ").")
            currentLocationName = null;
        }

        //adds 1 turn to the turn count
        elapsedTime++;

        //formats the response for the terminal
        response = response.join();
        response = response.replace(/,/g, '');
        return response;
    }
});