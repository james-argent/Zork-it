/**
 * Method to make a Rest GET call to the specified url calling back to the supplied function
 * in response to a successful, completed, call.
 * @param {String} [url] The URL to call.
 * @param {Function} [cFunc] The callback function on success.
 */
function httpGetRequest(url, cFunc) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            cFunc(xmlhttp.responseText);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
