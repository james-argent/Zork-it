function shrink() {
    var mapElement = document.getElementById('map');
    var terminalElement = document.getElementById('terminal');
    var spaceFiller = document.getElementById('spaceFill');

    if (mapElement.classList.contains('expanded')) {
        mapElement.classList.remove('expanded');
        mapElement.classList.add('contracted');
        terminalElement.classList.remove('minor');
        terminalElement.classList.add('major');
        spaceFiller.classList.remove('spaceFillHide');
        spaceFiller.classList.add('spaceFillShow')
    } else {
        mapElement.classList.remove('contracted');
        mapElement.classList.add('expanded');
        terminalElement.classList.remove('major');
        terminalElement.classList.add('minor');
        spaceFiller.classList.remove('spaceFillShow');
        spaceFiller.classList.add('spaceFillHide')
    }
}
