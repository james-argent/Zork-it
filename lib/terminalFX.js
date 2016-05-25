function resize() {
    var mapElement = document.getElementById('map');
    var terminalElement = document.getElementById('terminal');

    //shrink map
    if (mapElement.classList.contains('expanded')) {
        mapElement.classList.remove('expanded');
        mapElement.classList.add('contracted');
        terminalElement.classList.remove('minor');
        terminalElement.classList.add('major');
    } else {
        //expand map
        mapElement.classList.remove('contracted');
        mapElement.classList.add('expanded');
        terminalElement.classList.remove('major');
        terminalElement.classList.add('minor');
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
        document.getElementById(element).classList.add('recenter')
    }
    if (!document.getElementById('map').classList.contains('expanded') && document.getElementById(element).classList.remove('recenter')) {
        document.getElementById(element).classList.remove('recenter')
    }
}

function hideMessage() {
    if (document.getElementById('loseMessage').classList.contains('hidden')) {
        document.getElementById('winMessage').classList.add('hidden');
    } else {
        document.getElementById('loseMessage').classList.add('hidden')
    }
}