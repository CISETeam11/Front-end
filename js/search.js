//:: Handles searchbar input :://
const BASE_URL = "https://app-articles-ae-aut.azurewebsites.net/api/articles";

Vue.component('insert-title', {
    template: `
    <div>
    <input type="checkbox" @click='$emit("insert-title")'>Title</input> 
    </div>
    `
});

Vue.component('insert-author', {
    template: `
    <div> 
    <input type="checkbox" @click='$emit("insert-author")' >Author</input>
    </div>
    `
});
Vue.component('insert-year', {
    template: `
    <div>
    <input type="checkbox" @click='$emit("insert-year")' >Year</input>
    </div>
    `
});
Vue.component('insert-doi', {
    template: `
    <div>
    <input type="checkbox" @click='$emit("insert-doi")' >DOI</input>
    </div>
    `
});
Vue.component('insert-result', {
    template: `
    <div>
    <input type="checkbox" @click='$emit("insert-result")' >Result</input>
    </div>
    `
});


const vueTable = new Vue({
    el: '#search_result',
    data: {
        isBusy: false,
        sortBy: 'article.title',
        sortDesc: false,
        articles: [],
        fields: [{
                key: "article.title",
                label: "Title",
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
    },
    methods: {
        title: function() {
            this.fields = [{
                key: "article.title",
                label: "Title",
                sortable: true
            }, ]

        },
        author: function() {
            this.fields = [{
                key: 'article.author',
                label: 'Author',
                sortable: true
            }, ]

        },
        year: function() {
            this.fields = [{
                key: 'article.year',
                label: 'Year',
                sortable: true
            }, ]

        },
        doi: function() {
            this.fields = [{
                key: 'article.doi',
                label: 'DOI',
                sortable: true
            }, ]

        },
        result: function() {
            this.fields = [{
                key: 'results.result',
                label: 'Result',
                sortable: true
            }]

        },
    }

});

//:: A simple function to show user messages ::/
function showMessage(message, type) {
    var errorMessage = document.getElementById("error-msg");
    errorMessage.classList.remove("error-text");
    errorMessage.classList.remove("invisible");
    errorMessage.classList.remove("alert-danger");
    errorMessage.classList.remove("alert-success");

    if (type == "Error") {
        errorMessage.classList.add("error-text");
        errorMessage.innerHTML = message;
        document.getElementById("searchbar").focus();
        errorMessage.classList.add("alert-danger");
    } else {
        errorMessage.innerHTML = message;
        errorMessage.classList.add("alert-success");
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
    try {
        var searchbarInput = document.getElementsByClassName('search-input')[0].value;
        searchbarInput = searchbarInput.toUpperCase();
    } catch (err) {
        searchbarInput = testInput;
    }

    if (!validateSearchbar(searchbarInput)) {
        return;
    }

    if ($("#search_result").hasClass("invisible")) {
        $("#search_result").removeClass("invisible");
    }

    // TODO: Filter for SE Methods, TODO: Filter for date-range
    var url = `${BASE_URL}?$filter=contains(toupper(title),'${searchbarInput}')
    or contains(toupper(author),'${searchbarInput}')
    or contains(toupper(doi),'${searchbarInput}')
    or Results/any(a: contains(toupper(a/Result),'${searchbarInput}'))
    or Results/any(a: contains(toupper(a/Method),'${searchbarInput}'))
    or Results/any(a: contains(toupper(a/Methodology),'${searchbarInput}'))`;

    vueTable.isBusy = true;
    var client = new HttpClient(); // Calling api to get atricles.

    client.get(url, function(response) {
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
    });
}

function gotoBottom(id) {
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

function btnSearch() {
    handleSearch();
}

function validateSearchbar(searchbarInput) {
    var searchbar = document.getElementById("search-form");
    try {
        searchbar.classList.remove("search-error");
    } catch (err) {}
    if (searchbarInput != "") {
        if (searchbarInput.length < 2) {
            try {
                searchbar.classList.add("search-error");
                showMessage("Must be more than 2 or more characters.", "Error");
            } catch (err) {}
            return false;
        } else if (searchbarInput.length > 120) {
            try {
                searchbar.classList.add("search-error");
                showMessage("Must not be more than 120 characters.", "Error");
            } catch (err) {}
            return false;
        }
    }
    return true;
}
//document.onload = searchbarOnEnter();


//Exporting modules for testing.
module.exports = {
    validateSearchbar: validateSearchbar,
    handleSearch: handleSearch
};