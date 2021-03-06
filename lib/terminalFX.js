function resizeMap() {
    var mapElement = document.getElementById('map');
    var terminalElement = document.getElementById('terminal');
    var messageWin = document.getElementById('winMessage');
    var messageLose = document.getElementById('loseMessage');

    //shrink map
    if (mapElement.classList.contains('expanded')) {
        mapElement.classList.remove('expanded');
        mapElement.classList.add('contracted');
        terminalElement.classList.remove('minor');
        terminalElement.classList.add('major');
        //repositions the win/loss message
        messageLose.classList.add('recenter');
        messageWin.classList.add('recenter');
        } else {
        //expand map
        mapElement.classList.remove('contracted');
        mapElement.classList.add('expanded');
        terminalElement.classList.remove('major');
        terminalElement.classList.add('minor');
        //repositions the win/loss message
        messageLose.classList.remove('recenter');
        messageWin.classList.remove('recenter');
    }
}

//tested
function endGameFX(result) {
    if (result === 'won') {
        reposition('winMessage');
        document.getElementById('winMessage').classList.remove('hidden');
    } else {
        reposition('loseMessage');
        document.getElementById('loseMessage').classList.remove('hidden');
    }
}

function reposition(element) {
        if (document.getElementById('map').classList.contains('contracted')) {
        document.getElementById(element).classList.add('recenter');
        }
        if (!document.getElementById('map').classList.contains('contracted') && document.getElementById(element).classList.contains('recenter')) {
        document.getElementById(element).classList.remove('recenter');
    }
}

//tested
function hideMessage() {
    if (document.getElementById('loseMessage').classList.contains('hidden')) {
        document.getElementById('winMessage').classList.add('hidden');
    } else if (document.getElementById('winMessage').classList.contains('hidden'))  {
        document.getElementById('loseMessage').classList.add('hidden');
    }
}

function updateHealthBar(health) {
    if (health === 0) {
        //nothing
    } else {
        health = (health * 30 - 4) + "px";
    }
    document.getElementById('health').style.width=health;
}