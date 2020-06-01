//:: Handles searchbar input :://
const URL_ATRICLES = "https://app-articles-ae-aut.azurewebsites.net/api/articles";

const vueTable = new Vue({
    el: '#search_result',
    data: {
        isBusy: false,
        sortBy: 'article.title',
        sortDesc: false,
        articles: [],
        fields: [{
                key: 'article.title',
                label: 'Title',
                sortable: true
            },
            {
                key: 'article.author',
                label: 'Author',
                sortable: true
            },
            {
                key: 'article.year',
                label: 'Year',
                sortable: true
            },
            {
                key: 'article.doi',
                label: 'DOI',
                sortable: true
            },
            {
                key: 'results.result',
                label: 'Result',
                sortable: true
            }
        ]
    }
});

//:: A simple function to show user messages ::/
function showMessage(message, type) {
    var errorMessage = document.getElementById("error-msg");
    errorMessage.classList.remove("error-text");
    errorMessage.classList.remove("invisible");
    if (type == "Error") {
        errorMessage.classList.add("error-text");
        errorMessage.innerHTML = message;
    } else {
        errorMessage.innerHTML = message;
    }

}

//:: A fuction to handle pressing enter while focues on search bar :://
function searchbarOnEnter() {
    document.getElementById('searchbar').onkeypress = function(e) {
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
    var searchbarInput = document.getElementsByClassName('search-input')[0].value;
    searchbarInput = searchbarInput.toUpperCase();
    if (!validateSearchbar(searchbarInput)) {
        return;
    }

    vueTable.isBusy = true;
    var client = new HttpClient(); // Calling api to get atricles.

    client.get(URL_ATRICLES, function(response) {
        const articles = JSON.parse(response);
        let results = [];

        articles.forEach(article => {
            article.results.forEach(result => {
                results.push({ results: result, article: article });
            });
        });

        vueTable.articles = results;
        vueTable.isBusy = false;
        showMessage(articles.length + " article(s) found.");
        //var searchResult = document.getElementById("search_result");
        //searchResult.classList.remove("invisible");
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
    } else if (searchbarInput.length < 2) {
        searchbar.classList.add("search-error");
        showMessage("Must be more than 2 or more characters.", "Error");
        return false;
    } else if (searchbarInput.length > 120) {
        searchbar.classList.add("search-error");
        showMessage("Must not be more than 120 characters.", "Error");
        return false;
    }
    return true;
}


document.onload = searchbarOnEnter();