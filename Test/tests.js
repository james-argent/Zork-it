QUnit.test( "getMaxTurns test", function( assert ) {
    assert.ok( getMaxTurns("easy") === 200, "Passed!" );
    assert.ok( getMaxTurns("hard") === 52, "Passed!" );
    assert.ok( getMaxTurns("") === -1, "Passed!" );
    assert.ok( getMaxTurns("Easy") === -1, "Passed!" );
    assert.ok( getMaxTurns("Hard") === -1, "Passed!" );
    assert.ok( getMaxTurns("easypeasy") === -1, "Passed!" );
    assert.ok( getMaxTurns() === -1, "Passed!" );
    assert.ok( getMaxTurns(null) === -1, "Passed!" );
});

QUnit.test( "changeAttackChance test", function( assert ) {
    assert.ok( changeAttackChance("easy") === 15, "Passed!" );
    assert.ok( changeAttackChance("hard") === 25, "Passed!" );
    assert.ok( changeAttackChance("") === -1, "Passed!" );
    assert.ok( changeAttackChance("Easy") === -1, "Passed!" );
    assert.ok( changeAttackChance("Hard") === -1, "Passed!" );
    assert.ok( changeAttackChance("easypeasy") === -1, "Passed!" );
    assert.ok( changeAttackChance() === -1, "Passed!" );
    assert.ok( changeAttackChance(null) === -1, "Passed!" );
});

QUnit.test( "setDifficulty test", function( assert ) {
    assert.ok( setDifficulty("easy") === "easy", "Passed!" );
    assert.ok( setDifficulty("hard") === "hard", "Passed!" );
    assert.ok( setDifficulty("medium") === "medium", "Passed!" );
    assert.ok( setDifficulty("") === "medium", "Passed!" );
    assert.ok( setDifficulty("potato") === "medium", "Passed!" );
    assert.ok( setDifficulty("EASY") === "medium", "Passed!" );
    assert.ok( setDifficulty("HaRd") === "medium", "Passed!" );
    assert.ok( setDifficulty(null) === "medium", "Passed!" );
});