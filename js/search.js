//:: Handles searchbar input :://
const URL_ATRICLES = "https://app-articles-ae-aut.azurewebsites.net/api/articles";

//:: A simple function to show user messages ::/
function showMessage(message, type) {
    var errorMessage = document.getElementById("error-msg");
    errorMessage.classList.remove("error-text");
    if (type == "Error") {
        errorMessage.classList.add("error-text");
        errorMessage.innerHTML = message;
    } else {
        errorMessage.innerHTML = message;
    }

}

//:: A fuction to handle pressing enter while focues on search bar :://
function searchbarOnEnter() {
    document.getElementById('searchbar').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            handleSearch();
            return false;
        }
    }
}

//:: A function to get input from searchbar to get results from API :://
function handleSearch() {
    var articles = [];// An array to hold the filtered atricles.
    var searchbarInput = document.getElementsByClassName('search-input')[0].value;
    searchbarInput = searchbarInput.toUpperCase();
    if (!validateSearchbar(searchbarInput)) {
        return;
    }
    var client = new HttpClient();// Calling api to get atricles.
    client.get(URL_ATRICLES, function (response) {
        var articlesJSON = JSON.parse(response);
        articlesJSON.forEach(element => {
            element.author = element.author.toUpperCase();// check for author.
            if (element.author.indexOf(searchbarInput) !== -1) {
                articles.push(element);
            } else {
                element.title = element.title.toUpperCase();// check for title.
                if (element.title.indexOf(searchbarInput) !== -1) {
                    articles.push(element);
                }
            }
            if (articles.length == 0) {
                showMessage("0 articles found.")
                return;
            }
            // TODO: Filter for date-range
            // TODO: Filter for SE Methods
        });

        if (articles.length == 0) {
            showMessage("0 articles found.")
        } else {
            showMessage(articles.length + " article(s) found.");
            var title = document.getElementById("title");
            var averageRating = document.getElementById("averageRating");
            for (i = 0; i < articles.length; i++) {
                title.innerHTML += articlesJSON[i].title;
                averageRating.innerHTML += "Average Rating: " + articlesJSON[i].averageRating;
            }
        }
    });

}

function btnSearch() {
    handleSearch();
}

function validateSearchbar(searchbarInput) {
    var searchbar = document.getElementById("search-form");
    searchbar.classList.remove("search-error");
    if (searchbarInput == "") {
        searchbar.classList.add("search-error");
        showMessage("Cannot be empty.", "Error");
        return false;
    }
    else if (searchbarInput.length < 2) {
        searchbar.classList.add("search-error");
        showMessage("Must be more than 2 or more characters.", "Error");
        return false;
    }
    else if (searchbarInput.length > 120) {
        searchbar.classList.add("search-error");
        showMessage("Must not be more than 120 characters.", "Error");
        return false;
    }
    return true;
}


document.onload = searchbarOnEnter();

