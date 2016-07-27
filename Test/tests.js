QUnit.module( 'module a', {
    beforeEach: function () {
        clearResponse();
    }
});

QUnit.test("getMaxTurns test", function (assert) {
    assert.ok(getMaxTurns("easy") === 200, "Passed!");
    assert.ok(getMaxTurns("hard") === 52, "Passed!");
    assert.ok(getMaxTurns("Easy") === -1, "Passed!");
    assert.ok(getMaxTurns("easypeasy") === -1, "Passed!");
    assert.ok(getMaxTurns() === -1, "Passed!");
});

QUnit.test("changeAttackChance test", function (assert) {
    assert.ok(changeAttackChance("easy") === 15, "Passed!");
    assert.ok(changeAttackChance("hard") === 25, "Passed!");
    assert.ok(changeAttackChance("Easy") === -1, "Passed!");
    assert.ok(changeAttackChance("easypeasy") === -1, "Passed!");
    assert.ok(changeAttackChance() === -1, "Passed!");
});

QUnit.test("setDifficulty test", function (assert) {
    assert.ok(setDifficulty("easy") === "easy", "Passed!");
    assert.ok(setDifficulty("hard") === "hard", "Passed!");
    assert.ok(setDifficulty("medium") === "medium", "Passed!");
    assert.ok(setDifficulty("potato") === "medium", "Passed!");
    assert.ok(setDifficulty("EASY") === "medium", "Passed!");
});

QUnit.test("respond function test", function (assert) {
    respond("hello");
    assert.ok(getResponse() === " hello", "Passed!");
    respond("there");
    assert.ok(getResponse() === " hello there", "Passed!");
    respond("friend");
    assert.ok(getResponse() === " hello there friend", "Passed!");
});

QUnit.test("clearResponse test", function (assert) {
    respond("hello");
    clearResponse();
    assert.ok(getResponse().length === 0, "Passed!");
});

QUnit.test("responseLength test", function (assert) {
    respond("hello");
    assert.ok(responseLength() === 1, "Passed!");
    respond("there");
    assert.ok(responseLength() === 2, "Passed!");
    respond("friend");
    assert.ok(responseLength() === 3, "Passed!");
    clearResponse();
    respond("hello");
    respond("there");
    respond("friend");
    assert.ok(getResponse() === " hello there friend", "Passed!");
});

QUnit.test("setInitialGameState test", function (assert) {
    var initialState = setInitialGameState();
    assert.ok(initialState.displayedHealth === 10, "Passed!");
    assert.ok(initialState.inventory[0] === "pork", "Passed!");
    assert.ok(initialState.inventory[1] === "beef", "Passed!");
    assert.ok(initialState.currentCoordinates.x === 0, "Passed!");
    assert.ok(initialState.currentCoordinates.y === 0, "Passed!");
    assert.ok(initialState.difficulty === null, "Passed!");
    assert.ok(initialState.currentLocationName === null, "Passed!");
    assert.ok(initialState.attackChance === 20, "Passed!");
    assert.ok(initialState.elapsedTime === 0, "Passed!");
    assert.ok(initialState.health === 10, "Passed!");
    assert.ok(initialState.completedObjectives.length === 0, "Passed!");
    assert.ok(initialState.gameEnded === false, "Passed!");
    assert.ok(initialState.overtime === 0, "Passed!");
    assert.ok(initialState.restartQueried === false, "Passed!");
    assert.ok(initialState.quitQueried === false, "Passed!");
    assert.ok(initialState.maxTurns === 100, "Passed!");
});

QUnit.test("healthCheck test", function (assert) {
    healthCheck(10);
    healthCheck(0);
    assert.ok(getResponse() === " Your current health is: 10. Your current health is: 0.", "Passed!");
});

QUnit.test("Objective Complete test", function (assert) {
    assert.ok(objectiveComplete("london", ["paris","london"])[0] === "paris", "Passed!");
    assert.ok(getResponse() === " I've already done that here!", "Passed!");
    assert.ok(objectiveComplete("london", ["paris","london"])[1] === "london", "Passed!");
    assert.ok(objectiveComplete("london", ["paris","london"]).length === 2, "Passed!");
});

QUnit.test("Objective Not Complete test", function (assert) {
    assert.ok(objectiveComplete("london", ["paris"])[0] === "paris", "Passed!");
    assert.ok(responseLength() === 0, "Passed!");
    assert.ok(objectiveComplete("london", ["paris"])[1] === "london", "Passed!");
    assert.ok(objectiveComplete("london", ["paris"]).length === 2, "Passed!");
});

QUnit.test("Conversation test", function (assert) {
    assert.ok(talkTo(["sam"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Passed!");
    assert.notOk(talkTo(["tom"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Passed!");
    assert.notOk(talkTo(["sam"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Hey Jon!", "Passed!");
    assert.notOk(talkTo(["sam"], "Castle Black", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"tom", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Passed!");
    assert.notOk(talkTo(["sam"], "Las Vegas", [{"name": "Castle Black", "talkPerson": "sam"}], [{"name":"sam", "intro": "Hey Jon!"}]) === "Sam: Hey Jon!", "Passed!");
});

QUnit.test("Drop Item test", function (assert) {
    assert.ok(dropItem(["pork"],["beef"]).length === 1, "Passed!");
    assert.ok(getResponse() === " You can't drop what you don't have.", "Passed!");
    clearResponse();
    assert.ok(dropItem(["pork"],["beef"])[0] === "pork", "Passed!");
    assert.ok(getResponse() === " You can't drop what you don't have.", "Passed!");
    clearResponse();
    assert.ok(dropItem(["pork","beef"],["pork"]).length === 1, "Passed!");
    assert.ok(getResponse() === " You dropped your pork.", "Passed!");
    clearResponse();
    assert.ok(dropItem(["pork","beef"],["pork"])[0] === "beef", "Passed!");
    assert.ok(getResponse() === " You dropped your pork.", "Passed!");
    clearResponse();
    assert.ok(dropItem(["pork","beef","wine"],["wine","pork"]).length === 2, "Passed!");
    assert.ok(getResponse() === " You dropped your wine.", "Passed!");
    clearResponse();
    assert.ok(dropItem(["pork","beef","wine"],["wine","pork"])[0] === "pork", "Passed!");
    assert.ok(getResponse() === " You dropped your wine.", "Passed!");
});

QUnit.test("Get Inventory Info test", function (assert) {
    getInventory([]);
    assert.ok(getResponse() === " Your inventory is empty.", "Passed!");
    clearResponse();
    getInventory(["beef"]);
    assert.ok(getResponse() === " Your inventory contains: beef.", "Passed!");
    clearResponse();
    getInventory(["beef", "pork"]);
    assert.ok(getResponse() === " Your inventory contains: beef and pork.", "Passed!");
    clearResponse();
    getInventory(["beef", "pork", "wine"]);
    assert.ok(getResponse() === " Your inventory contains: beef, pork, and wine.", "Passed!");
});

QUnit.test("Look command test", function (assert) {
    look(false,"hard");
    assert.ok(getResponse() === " There's nothing around.", "Passed!");
    clearResponse();
    look(true,"medium");
    assert.ok(getResponse() === " ", "Passed!");
    clearResponse();
    look(true,"hard");
    assert.ok(getResponse() === " ", "Passed!");
    clearResponse();
    look(false,"easy");
    assert.ok(getResponse() === " ", "Passed!");
});

QUnit.test("Play Again test", function (assert) {
    assert.notOk(playAgain("yes") === "Would you like play again?", "Passed!");
    assert.ok(playAgain("no") === "Would you like play again?", "Passed!");
    assert.ok(playAgain("") === "Would you like play again?", "Passed!");
});

QUnit.test("1 in, 1 out, full health, Eating test", function (assert) {
    var inventory = ["beef"];
    assert.ok(eat(["beef"], inventory, 10) === "", "Passed!");
    assert.ok(inventory.length === 0, "Passed!");
    assert.ok(getResponse() === " You ate your beef.", "Passed!");
});

QUnit.test("4 in, 1 out, half health, Eating test", function (assert) {
    var inventory = ["beef", "beef", "beef", "beef"];
    assert.ok(eat(["beef"], inventory, 5) === "", "Passed!");
    assert.ok(inventory.length === 3, "Passed!");
    assert.ok(getResponse() === " You ate your beef.", "Passed!");
});

QUnit.test("2 in, 2 out, Eating test", function (assert) {
    var inventory = ["beef", "pork"];
    assert.ok(eat(["beef", "pork"], inventory, 5) === "", "Passed!");
    assert.ok(inventory.length === 1 && inventory[0] === "pork", "Passed!");
    assert.ok(getResponse() === " You ate your beef.", "Passed!");
});

QUnit.test("4 in, 1 out, Half-way, Eating test", function (assert) {
    var inventory = ["beef", "beef", "pork", "pork"];
    assert.ok(eat(["pork"], inventory, 5) === "", "Passed!");
    assert.ok(inventory.length === 3, "Passed!");
    assert.ok(inventory[0] === "beef", "Passed!");
    assert.ok(inventory[1] === "beef", "Passed!");
    assert.ok(inventory[2] === "pork", "Passed!");
    assert.ok(getResponse() === " You ate your pork.", "Passed!");
});

QUnit.test("2 in, 0 out, Half-way, Eating test", function (assert) {
    var inventory = ["beef", "pork"];
    assert.notOk(eat(["chicken"], inventory, 5) === "", "Passed!");
    assert.ok(inventory.length === 2, "Passed!");
});