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
