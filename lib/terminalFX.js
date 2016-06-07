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
        if (messageWin.classList.contains('hidden')) {
            messageLose.classList.remove('recenter');
        } else {
            messageWin.classList.remove('recenter');
        }
    } else {
        //expand map
        mapElement.classList.remove('contracted');
        mapElement.classList.add('expanded');
        terminalElement.classList.remove('major');
        terminalElement.classList.add('minor');
        //repositions the win/loss message
        if (messageWin.classList.contains('hidden')) {
            messageLose.classList.add('recenter');
        } else {
            messageWin.classList.add('recenter');
        }
    }
}

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
        if (document.getElementById('map').classList.contains('expanded')) {
        document.getElementById(element).classList.add('recenter');
        }
        if (!document.getElementById('map').classList.contains('expanded') && document.getElementById(element).classList.remove('recenter')) {
        document.getElementById(element).classList.remove('recenter');
    }
}

function hideMessage() {
    if (document.getElementById('loseMessage').classList.contains('hidden')) {
        document.getElementById('winMessage').classList.add('hidden');
    } else {
        document.getElementById('loseMessage').classList.add('hidden');
    }
}

function updateHealthBar(health) {
    health = (health * 30 - 4) + "px";
    document.getElementById('health').style.width=health;
}