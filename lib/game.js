var inventory = ["pork", "beef"];
var currentCoordinates = {x:0,y:0};
var i, j, difficulty;
var elapsedTime = 0;

var terminal = new Terminal('terminal', {}, {
    execute: function (cmd, args) {

        //Make the input all lower case
        cmd = cmd.toLowerCase();
        for (var i = 0; i < args.length; i++)
          args[i] = args[i].toLowerCase();

        var response = [];
        var responseCount = 0;

        var respond = function(output) {
            response.push(output);
            responseCount++
        };

        //set the difficulty
        if (elapsedTime === 0) {
            if (cmd === "easy") {
                respond(" Easy selected.");
                difficulty = "easy";
            } else if (cmd === "medium") {
                respond(" Medium selected.");
                difficulty = "medium";
            } else if (cmd === "hard") {
                respond(" Hard selected.");
                difficulty = "hard";
            } else {
                respond(" Looks like you didn't select a difficulty. It has been set to medium by default.");
                difficulty = "medium";
            }
        }

        var location1 = {x: 0, y: 0, name: "Castle Black", comment: "You like it here."};
        var location2 = {x: 2, y: 0, name: "Eastwatch-by-the-Sea", comment: "Eastern castle on the wall."};
        var location3 = {x: -2, y: 0, name: "Shadow Tower", comment: "Western castle on the wall."};
        var location4 = {x: -1, y: 1, name: "Crastor's Keep", comment: "Keep away from his daughter-wives."};
        var location5 = {x: -2, y: 2, name: "The Fist of the First Men", comment: "A big battle happened here."};
        var locationList = [location1, location2, location3, location4, location5];

        //inventory check
        if (cmd === "inventory") {
            if (inventory.length == 0) {
                respond(" Your inventory is empty.")
            } else {
                respond(" Your inventory contains: " + inventory + ".")
            }
        }

        //deals with eating
        var eatArray = ["fish", "beef", "pork"];
        var eat = function(args) {
            for (i = 0; i < args.length; i++) {
                if (eatArray.includes(args[i])) {
                    for (j = 0; j < inventory.length; j++) {
                        if (args[i] === inventory[j]) {
                            inventory.splice(j,1);
                            respond(" You ate your " + args[i] + ".")
                        }
                    }
                }
            }
        };
        if (cmd === "eat") {
            respond(eat(args))
        }

        //function that deals with movement
        var moveArray = ["north", "east", "south", "west"];
        var move = function(args) {
            for (i = 0; i < args.length; i++) {
                if (moveArray.includes(args[i])) {
                    respond(" You moved " + args[i] + ".");
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

        if (responseCount === 0) {
            respond(" Sorry, I don't know what you meant.")
        }

        //tells the user where they are
        for (i = 0; i < locationList.length; i++) {
            if ((currentCoordinates.x === locationList[i].x) && (currentCoordinates.y === locationList[i].y))
            {
                respond(" You are at " + locationList[i].name + ". " + locationList[i].comment)
            }
        }

        elapsedTime++;
        response = response.join();
        response = response.replace(/,/g, '');
        return response
    }
});