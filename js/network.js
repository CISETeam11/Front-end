//A class to handle http requests//
class HttpClient {
    constructor() {
        this.get = function (url, aCallback) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    aCallback(httpRequest.responseText);
                }
            };
            httpRequest.open("GET", url, true);
            httpRequest.send(null);
        };
    }
}

module.exports = HttpClient;
