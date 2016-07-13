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