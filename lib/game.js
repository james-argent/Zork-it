var inventory = ["pork", "beef"]
var currentCoordinates = [0,0]

var terminal = new Terminal('terminal', {}, {
    execute: function (cmd, args) {

        //Make the input all lower case
        cmd = cmd.toLowerCase();
        for (var i = 0; i < args.length; i++)
          args[i] = args[i].toLowerCase();

        var location1 = {x: 0, y: 0, name: "Castle Black", comment: "You like it here."};
        var location2 = {x: 2, y: 0, name: "Eastwatch-by-the-Sea", comment: "Eastern castle on the wall."};
        var location3 = {x: -2, y: 0, name: "Shadow Tower", comment: "Western castle on the wall."};
        var location4 = {x: -1, y: 1, name: "Crastor's Keep", comment: "Keep away from his daughter-wives."};
        var location5 = {x: -2, y: 2, name: "Fist of the First Men", comment: "A big battle happened here."};

        var locationList = [location1, location2, location3, location4, location5];

        /*for (var i = 0; i < locationList.length; i++) {
            if ((currentCoordinates[0] === locationList[i].x) && (currentCoordinates[1] === locationList[i].y))
            {
                return locationList[i].comment
            }
        }*/

        if (cmd === "inventory") {
            if (inventory.length == 0) {
                return "Your inventory is empty."
            } else {
                return "Your inventory contains: " + inventory
            }
        }

        var eatArray = ["fish", "beef", "pork"];
        var eat = function(args) {
            for (var i = 0; i < args.length; i++) {
                if (eatArray.includes(args[i])) {
                    for (var j = 0; j < inventory.length; j++) {
                        if (args[i] === inventory[j]) {
                            inventory.splice(j,1)
                            return "You ate your " + args[i] + "."
                        }
                    }
                }
            }
        };
        if (cmd === "eat") {
            return eat(args);
        }

        var moveArray = ["north", "east", "south", "west"];

        var move = function(args) {
            for (var i = 0; i < args.length; i++) {
                if (moveArray.includes(args[i])) {
                    return "You moved " + args[i] + "."
                }
            }
        };
        if ((cmd === "move") || (cmd === "go")) {
            return move(args);
        }
    }
});