QUnit.module( 'module a', {
    beforeEach: function () {
        clearResponse();
    }
});

QUnit.test("getMaxTurns test", function (assert) {
    assert.ok(getMaxTurns("easy") === 200, "Easy difficulty");
    assert.ok(getMaxTurns("hard") === 52, "Hard difficulty");
    assert.ok(getMaxTurns("easypeasy") === -1, "Non-valid difficulty");
    assert.ok(getMaxTurns() === -1, "No given difficulty");
});

QUnit.test("changeAttackChance test", function (assert) {
    assert.ok(changeAttackChance("easy") === 15, "Easy difficulty");
    assert.ok(changeAttackChance("hard") === 25, "Hard difficulty");
    assert.ok(changeAttackChance("easypeasy") === -1, "Non-valid difficulty");
    assert.ok(changeAttackChance() === -1, "No given difficulty");
});

QUnit.test("setDifficulty test", function (assert) {
    assert.ok(setDifficulty("easy") === "easy", "Easy difficulty selected");
    assert.ok(setDifficulty("hard") === "hard", "Hard difficulty selected");
    assert.ok(setDifficulty("medium") === "medium", "Medium difficulty selected");
    assert.ok(setDifficulty("potato") === "medium", "Non-valid difficulty selected - medium by default");
});

QUnit.test("respond function test", function (assert) {
    respond("hello");
    assert.ok(getResponse() === " hello", "One response");
    respond("there");
    assert.ok(getResponse() === " hello there", "Two responses");
    respond("friend");
    assert.ok(getResponse() === " hello there friend", "Three responses");
});

QUnit.test("clearResponse test", function (assert) {
    respond("hello");
    clearResponse();
    assert.ok(getResponse().length === 0, "Clear works");
});

QUnit.test("responseLength test", function (assert) {
    respond("hello");
    assert.ok(responseLength() === 1, "One response length");
    respond("there");
    assert.ok(responseLength() === 2, "Two responses length");
    respond("friend");
    assert.ok(responseLength() === 3, "Three responses length");
    assert.ok(getResponse() === " hello there friend", "Full string");
});

QUnit.test("setInitialGameState test", function (assert) {
    var initialState = setInitialGameState();
    assert.ok(initialState.displayedHealth === 10, "displayed health");
    assert.ok(initialState.inventory[0] === "pork", "inventory");
    assert.ok(initialState.inventory[1] === "beef", "inventory");
    assert.ok(initialState.currentCoordinates.x === 0, "x-coordinate");
    assert.ok(initialState.currentCoordinates.y === 0, "y-coordinate");
    assert.ok(initialState.difficulty === null, "difficulty");
    assert.ok(initialState.currentLocationName === null, "location name");
    assert.ok(initialState.attackChance === 20, "attack chance");
    assert.ok(initialState.elapsedTime === 0, "elapsed time");
    assert.ok(initialState.health === 10, "health");
    assert.ok(initialState.completedObjectives.length === 0, "completed objectives");
    assert.ok(initialState.gameEnded === false, "game ended");
    assert.ok(initialState.overtime === 0, "overtime");
    assert.ok(initialState.restartQueried === false, "restart queried");
    assert.ok(initialState.quitQueried === false, "quit queried");
    assert.ok(initialState.maxTurns === 100, "max turns");
});

QUnit.test("healthCheck test", function (assert) {
    healthCheck(10);
    healthCheck(0);
    assert.ok(getResponse() === " Your current health is: 10. Your current health is: 0.", "Health check response");
});

QUnit.test("Objective Complete test", function (assert) {
    assert.ok(objectiveComplete("london", ["paris","london"])[0] === "paris", "Array contents");
    assert.ok(getResponse() === " I've already done that here!", "Already done response");
    assert.ok(objectiveComplete("london", ["paris","london"])[1] === "london", "Array contents");
    assert.ok(objectiveComplete("london", ["paris","london"]).length === 2, "Array length");
});

QUnit.test("Objective Not Complete test", function (assert) {
    assert.ok(objectiveComplete("london", ["paris"])[0] === "paris", "Array contents");
    assert.ok(responseLength() === 0, "No response given");
    assert.ok(objectiveComplete("london", ["paris"])[1] === "london", "Array contents");
    assert.ok(objectiveComplete("london", ["paris"]).length === 2, "New array length");
});

QUnit.test("Conversation test", function (assert) {
    assert.ok(talkTo(["sam"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Correct functionality");
    assert.notOk(talkTo(["tom"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Wrong name given check");
    assert.notOk(talkTo(["sam"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Hey Jon!", "No name response check");
    assert.notOk(talkTo(["sam"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"tom", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Mistake in JSON");
    assert.notOk(talkTo(["sam"], "Las Vegas", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Wrong place check");
});

QUnit.test("Drop Item test", function (assert) {
    assert.ok(dropItem(["pork"],["beef"]).length === 1, "Can't drop");
    assert.ok(getResponse() === " You can't drop what you don't have.", "Can't response");
    assert.ok(dropItem(["pork"],["beef"])[0] === "pork", "Not-dropped array contents");
    clearResponse();
    assert.ok(dropItem(["pork","beef"],["pork"]).length === 1, "Item dropped");
    assert.ok(getResponse() === " You dropped your pork.", "Dropped response");
    clearResponse();
    assert.ok(dropItem(["pork","beef"],["pork"])[0] === "beef", "Post-drop array contents");
    clearResponse();
    assert.ok(dropItem(["pork","beef","wine"],["wine","pork"]).length === 2, "Multi-drop request, only 1 drop");
    assert.ok(getResponse() === " You dropped your wine.", "Correct item dropped");
    assert.ok(dropItem(["pork","beef","wine"],["wine","pork"])[0] === "pork", "Second drop-requested item not dropped");
});

QUnit.test("Get Inventory Info (grammar) test", function (assert) {
    getInventory([]);
    assert.ok(getResponse() === " Your inventory is empty.", "Empty inventory");
    clearResponse();
    getInventory(["beef"]);
    assert.ok(getResponse() === " Your inventory contains: beef.", "One item in inventory");
    clearResponse();
    getInventory(["beef", "pork"]);
    assert.ok(getResponse() === " Your inventory contains: beef and pork.", "Two items in inventory");
    clearResponse();
    getInventory(["beef", "pork", "wine"]);
    assert.ok(getResponse() === " Your inventory contains: beef, pork, and wine.", "Three items in inventory");
});

QUnit.test("Look command test", function (assert) {
    look(false,"hard");
    assert.ok(getResponse() === " There's nothing around.", "Not located and hard difficulty");
    clearResponse();
    look(true,"medium");
    assert.ok(getResponse() === " ", "Located and medium difficulty");
    clearResponse();
    look(true,"hard");
    assert.ok(getResponse() === " ", "Located and hard difficulty");
    clearResponse();
    look(false,"easy");
    assert.ok(getResponse() === " ", "Not located and easy difficulty");
});

QUnit.test("Play Again test", function (assert) {
    assert.notOk(playAgain("yes") === "Would you like play again?", "Correct response accepted check");
    assert.ok(playAgain("no") === "Would you like play again?", "Wrong input");
    assert.ok(playAgain("") === "Would you like play again?", "No input");
});

QUnit.test("1 in, 1 out, Eating test", function (assert) {
    var inventory = ["beef"];
    assert.ok(eat(["beef"], inventory, 5) === "", "Returns nothing to break");
    assert.ok(inventory.length === 0, "Item removed");
    assert.ok(getResponse() === " You ate your beef.", "Response check");
});

QUnit.test("4 in, 1 out, Eating test", function (assert) {
    var inventory = ["beef", "beef", "beef", "beef"];
    assert.ok(eat(["beef"], inventory, 5) === "", "Returns nothing to break");
    assert.ok(inventory.length === 3, "ONE item removed");
    assert.ok(getResponse() === " You ate your beef.", "Response check");
});

QUnit.test("2 in, 2 out, Eating test", function (assert) {
    var inventory = ["beef", "pork"];
    assert.ok(eat(["beef", "pork"], inventory, 9) === "", "Returns nothing to break");
    assert.ok(inventory.length === 1 && inventory[0] === "pork", "Only the one, correct, item removed");
    assert.ok(getResponse() === " You ate your beef.", "Response check");
});

QUnit.test("4 in, 1 out, Half-way, Eating test", function (assert) {
    var inventory = ["beef", "beef", "pork", "pork"];
    assert.ok(eat(["pork"], inventory, 5) === "", "Returns nothing to break");
    assert.ok(inventory.length === 3, "Only the one, correct, item removed");
    assert.ok(inventory[0] === "beef" && inventory[1] === "beef" && inventory[2] === "pork", "Remaining items correct");
    assert.ok(getResponse() === " You ate your pork.", "Response check");
});

QUnit.test("2 in, 0 out, Half-way, Eating test", function (assert) {
    var inventory = ["beef", "pork"];
    assert.notOk(eat(["computer"], inventory, 5) === "", "Incorrect input shouldn't return");
    assert.ok(inventory.length === 2, "No items gone");
});

QUnit.test("1 in, 1 out, Full health eating test", function (assert) {
    var inventory = ["beef"];
    assert.ok(eat(["beef"], inventory, 10) === "", "Full health should return nothing to break");
    assert.ok(inventory.length === 1, "No items gone");
    assert.ok(getResponse() === " You are at your maximum health already.", "Max health already response check");
});