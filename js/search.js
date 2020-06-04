//:: Handles searchbar input :://
const BASE_URL = "https://app-articles-ae-aut.azurewebsites.net/api/articles";

const resultsTable = new Vue({
    el: '#search_result',
    data: {
        stitle: true,
        sauthor: true,
        syear: true,
        sdoi: true,
        smethod: false,
        isBusy: false,
        sortBy: 'article.title',
        sortDesc: false,
        articles: [],
        isEmpty: true,
        lastQueryUrl: null,
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
        }]
    },
    // check checkbox status and display column //
    watch: {
        stitle: function (isChecked) {
            if (isChecked) {
                Vue.set(this.fields, 0, [{
                    key: "article.title",
                    label: "Title",
                    sortable: true
                }])
            }
            else {
                Vue.set(this.fields, 0, []);
            }
        },
        sauthor: function (isChecked) {
            if (isChecked) {
                Vue.set(this.fields, 1, [{
                    key: 'article.author',
                    label: 'Author',
                    sortable: true
                }])
            }
            else {
                Vue.set(this.fields, 1, []);
            }
        },
        syear: function (isChecked) {
            if (isChecked) {
                Vue.set(this.fields, 2, [{
                    key: 'article.year',
                    label: 'Year',
                    sortable: true
                }])
            }
            else {
                Vue.set(this.fields, 2, []);
            }
        },
        sdoi: function (isChecked) {
            if (isChecked) {
                Vue.set(this.fields, 3, [{
                    key: 'article.doi',
                    label: 'DOI',
                    sortable: true
                }])
            }
            else {
                Vue.set(this.fields, 3, []);
            }
        },
        smethod: function (isChecked) {
            if (isChecked) {
                Vue.set(this.fields, 5, [{
                    key: 'results.method',
                    label: 'Method',
                    sortable: true
                }])
            }
            else {
                Vue.set(this.fields, 5, []);
            }
        }
    }
});

const advancedSearchForm = new Vue({
    el: '#advanced-search',
    data: {
        show: true,
        visible: false,
        startYear: 2000,
        endYear: new Date().getFullYear(),
        logicalOperator: 'and',
        form: {
            field: null,
            operator: null,
            value: null
        },
        queryYears: getYearRange(),
        logicalOperators: [
            { value: 'and', text: 'AND' },
            { value: 'or', text: 'OR' }
        ],
        queryFields: [
            { value: null, text: '- Select Field -', disabled: true },
            { value: 'se-method', text: 'SE Method' },
            { value: 'se-methodology', text: 'SE Methodology' }
        ],
        queryOperators: [
            { value: null, text: '- Operator -', disabled: true },
            { value: 'eq', text: 'Is Equal To' },
            { value: 'contains', text: 'Contains' }
        ],
        queryValues: [
            { value: null, text: '- Value -', disabled: true },
            { value: 'tdd', text: 'TDD' },
            { value: 'bdd', text: 'BDD' }
        ]
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault()
            //alert(JSON.stringify(this.form))
            advancedSearch();
            this.visible = false;
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset form values
            this.startYear = 2000;
            this.endYear = new Date().getFullYear();
            this.logicalOperator = 'and';
            this.form.field = null
            this.form.operator = null
            this.form.value = null

            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
});

function getYearRange() {
    const currentYear = new Date().getUTCFullYear();
    const numberOfYears = 40;
    return Array(currentYear - (currentYear - numberOfYears)).fill('').map((v, index) => currentYear - index);
}

//:: A simple function to show user messages ::/
function showMessage(message, type) {
    var errorMessage = document.getElementById("error-msg");
    errorMessage.classList.remove("error-text");
    errorMessage.classList.remove("no-display");
    errorMessage.classList.remove("alert-danger");
    errorMessage.classList.remove("alert-success");

    if (type == "Error") {
        errorMessage.classList.add("error-text");
        errorMessage.innerHTML = message;
        document.getElementById("searchbar").focus();
        errorMessage.classList.add("alert-danger");
    }

}

//:: Event handler pressing enter while focues on search bar :://
document.getElementById('searchbar').onkeypress = function (e) {
    if (!e) e = window.event;

    var keyCode = e.keyCode || e.which;

    if (keyCode == '13') {
        const searchInput = $('#searchbar').val();
        quickSearch(searchInput);
        return false;
    }
}


//:: A function to get input from searchbar to get results from API :://
function quickSearch(searchInput) {    
    if (!validateSearchbar(searchInput)) {
        return;
    }

    if ($("#search_result").hasClass("no-display")) {
        $("#search_result").removeClass("no-display");
    }

    let url = BASE_URL;

    if (searchInput.length > 0) {
        if (Number.isInteger(Number(searchInput))) {
            url += `?$filter=year eq ${parseInt(searchInput)}`;
        } else if (typeof(searchInput) == "string") {
            searchInput = searchInput.toUpperCase();
            url += `?$filter=contains(toupper(title),'${searchInput}') ` +
            `or contains(toupper(author),'${searchInput}') ` +
            `or contains(toupper(doi),'${searchInput}') ` +
            `or Results/any(a: contains(toupper(a/Result),'${searchInput}')) ` +
            `or Results/any(a: contains(toupper(a/Method),'${searchInput}')) ` +
            `or Results/any(a: contains(toupper(a/Methodology),'${searchInput}'))`;
        } 
    }

    queryArticles(url, searchInput);
}

function advancedSearch() {

}

function queryArticles(url, resultFilter) {
    if (resultsTable.lastQueryUrl == url)
        return;
    
    resultsTable.isBusy = true;
    resultsTable.lastQueryUrl = url;
    var client = new HttpClient();

    // Calling api to get articles.
    client.get(url, function(response) {
        const articles = JSON.parse(response);
        let results = [];

        articles.forEach(article => {
            article.results.forEach(result => {
                if (!filterResults(article, result, resultFilter))
                    return;
                
                results.push({ results: result, article: article });
            });
        });

        resultsTable.articles = results;
        resultsTable.isEmpty = results.length == 0;
        resultsTable.isBusy = false;
    });
}

function filterResults(article, result, resultFilter) {
    let hasValue = false;

    Object.values(article).forEach(value => {
        if (parseInt(resultFilter) == article.year) {
            hasValue = true;
            return;
        } else if (typeof(value) == "string" && value.toUpperCase().includes(resultFilter)) {
            hasValue = true;
            return;
        }
    });

    if (hasValue)
        return true

    Object.values(result).forEach(value => {
        if (value && value.toUpperCase().includes(resultFilter)) {
            hasValue = true;
            return;
        }
    });

    return hasValue;
}

function removeQuery(btnID){
    var query = document.getElementById(btnID);
    query.remove();
}

function addQuery(){
    var table = document.getElementById("query-table");
    var lastRowNum;
    var tr;

    for (var i = 0, row; row = table.rows[i]; i++) {
        tr=row.cloneNode(true);
        lastRowNum=i;
        console.log(lastRowNum+1);
    }

    try{
        tr.id="query-"+(lastRowNum+1);
        var btn=tr.children[0];
        btn=btn.children[0];
        btn=btn.children[0];
        btn=btn.children[3];
        btn.id="query-"+(lastRowNum+1);
        table.children[0].appendChild(tr);
    } catch(err) {
        table.children[0].appendChild(queryTemplate);
    }
}

function gotoBottom(id) {
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

function validateSearchbar(searchbarInput) {
    var searchbar = document.getElementById("search-form");
    try {
        searchbar.classList.remove("search-error");
    } catch (err) { }
    if (searchbarInput != "") {
        if (searchbarInput.length < 2) {
            try {
                searchbar.classList.add("search-error");
                showMessage("Must be more than 2 or more characters.", "Error");
            } catch (err) { }
            return false;
        } else if (searchbarInput.length > 120) {
            try {
                searchbar.classList.add("search-error");
                showMessage("Must not be more than 120 characters.", "Error");
            } catch (err) { }
            return false;
        }
    }
    return true;
}
//document.onload = searchbarOnEnter();

var queryTemplate = document.getElementById("query-1");

//Exporting modules for testing.
module.exports = {
    validateSearchbar: validateSearchbar,
    quickSearch: quickSearch
};