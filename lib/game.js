var inventory = ["pork", "beef"];
var currentCoordinates = {x:0,y:0};
var i, j, difficulty, currentLocationName;
var elapsedTime = 0;
var health = 10;
var maxInventory = 7;
var maxHealth;
var inventoryExpanded = [];

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

        //set the difficulty
        if (elapsedTime === 0) {
            if (cmd === "easy") {
                respond("Easy selected.");
                difficulty = "easy";
            } else if (cmd === "medium") {
                respond("Medium selected.");
                difficulty = "medium";
            } else if (cmd === "hard") {
                respond("Hard selected.");
                difficulty = "hard";
            } else {
                respond("Looks like you didn't select a difficulty. It has been set to medium by default.");
                difficulty = "medium";
            }
        }

        var location1 = {x: 0, y: 0, name: "Castle Black", comment: "You like it here."};
        var location2 = {x: 2, y: 0, name: "Eastwatch-by-the-Sea", comment: "Eastern castle on the wall."};
        var location3 = {x: -2, y: 0, name: "Shadow Tower", comment: "Western castle on the wall."};
        var location4 = {x: -1, y: 1, name: "Crastor's Keep", comment: "Keep away from his daughter-wives.", item: "pork"};
        var location5 = {x: -2, y: 2, name: "The Fist of the First Men", comment: "A big battle happened here.", item: "dragonglass"};
        var location6 = {x: 2, y: 2, name: "Hardhome", comment: "The wildings have a settlement here. Best not disturb them."};
        var location7 = {x: 0, y: -1, name: "Moletown", comment: "Known for its brothel."};
        var location8 = {x: 0, y: -4, name: "Winterfell", comment: "My old home. The north remembers."};
        var location9 = {x: 2, y: -3, name: "The Dreadfort", comment: "The seat of the traitorous House Bolton."};
        var location10 = {x: -1, y: 0, name: "Icemark", comment: "An abandoned castle along the wall. There's noone here."};
        var location11 = {x: 1, y: 0, name: "Rimegate", comment: "An abandoned castle along the wall. There's noone here."};
        var location12 = {x: -1, y: -1, name: "Queen's Crown", comment: "An abandoned holdfast and village."};
        var location13 = {x: 2, y: -2, name: "Karhold", comment: "A strong northern castle and the seat of House Karstark."};
        var locationList = [location1, location2, location3, location4, location5, location6, location7, location8, location9, location10, location11, location12, location13];

        //inventory check
        if (cmd === "inventory") {
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

        //allows the user to remove items from their inventory
        if (cmd === "drop") {
            for (i = 0; i < args.length; i++) {
                for (j = 0; j < inventory.length; j++) {
                    if (args[i] === inventory[j]) {
                        inventory.splice(j,1);
                        respond("You dropped your " + args[i] + ".");
                        break;
                    }
                }
            }
        }

        //health check
        if (cmd === "health") {
            (respond("Your current health is: " + health + "."))
        }

        //deals with eating
        var eatArray = ["fish", "beef", "pork"];
        var eat = function(args) {
            for (i = 0; i < args.length; i++) {
                if (eatArray.includes(args[i])) {
                    for (j = 0; j < inventory.length; j++) {
                        if (args[i] === inventory[j]) {
                            inventory.splice(j,1);
                            if (health < maxHealth) {
                                health++;
                                respond("You ate your " + args[i] + ". Your health is now " + health + ".")
                            } else {
                                respond("You ate your " + args[i] + ". You are at your max health.")
                            }
                        }
                    }
                }
            }
        };
        if (cmd === "eat") {
            respond(eat(args))
        }

        //deals with taking items
        if (cmd === "take") {
            for (i = 0; i < locationList.length; i++) {
                if (locationList[i].name === currentLocationName && locationList[i].item !== null && args.includes(locationList[i].item)) {
                    if (inventory.length < maxInventory) {
                        inventory.push(locationList[i].item);
                        respond("You put the " + locationList[i].item + " in your inventory.")
                    } else {
                        respond("Your inventory is full already.")
                    }
                }
            }
        }

        //ends the game if the character loses all their health
        if (health < 1) {
            //end game
        }

        //function that deals with movement
        var moveArray = ["north", "east", "south", "west"];
        var move = function(args) {
            for (i = 0; i < args.length; i++) {
                if (moveArray.includes(args[i])) {
                    respond(" You went " + args[i] + ".");
                    switch(args[i]) {
                        case "north":
                            currentCoordinates.y++;
                            break;
                        case "east":
                            currentCoordinates.x++;
                            break;
                        case "south":
                            currentCoordinates.y--;
                            break;
                        case "west":
                            currentCoordinates.x--;
                            break;
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

        elapsedTime++;
        response = response.join();
        response = response.replace(/,/g, '');
        return response;
    }
});