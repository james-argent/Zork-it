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
    assert.ok(getResponse() === "", "Passed!");
});

QUnit.test("responseLength test", function (assert) {
    respond("hello");
    assert.ok(responseLength() === 1, "Passed!");
    respond("there");
    assert.ok(responseLength() === 2, "Passed!");
    respond("friend");
    assert.ok(responseLength() === 3, "Passed!");
});

QUnit.test("responseLength test", function (assert) {
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