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

const SearchForm = new Vue({
    el: '#search',
    data: {
        show: true,
        visible: false,
        form: {
            startYear: 2000,
            endYear: new Date().getFullYear(),
            logicalOperator: 'and',
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
            { value: null, text: '- Field -', disabled: true },
            { value: 'Method', text: 'SE Method' }
        ],
        queryOperators: [
            { value: null, text: '- Operator -', disabled: true },
            { value: 'eq', text: 'Is Equal To' }
        ],
        queryValues: [
            { value: null, text: '- Value -', disabled: true },
            'TDD',
            'BDD',
            'Pair Programming',
            'Planning Poker',
            'Daily Standup Meetings',
            'Story Boards',
            'Story Mapping',
            'Continuous Integration',
            'Retrosepctives',
            'Burn Down Charts',
            'Requirements Prioritisation',
            'Version Control',
            'Code Sharing'
        ]
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault()
            search(this.form);
            this.visible = false;
        },
        onReset(evt) {
            evt.preventDefault()
            // Reset form values
            this.form.startYear = 2000;
            this.form.endYear = new Date().getFullYear();
            this.form.logicalOperator = 'and';
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
    const numberOfYears = 60;
    return Array(currentYear - (currentYear - numberOfYears)).fill('').map((v, index) => currentYear - index);
}

function search(form) {
    let url = BASE_URL;

    if ($("#search_result").hasClass("no-display")) {
        $("#search_result").removeClass("no-display");
    }

    // Swap year ranges if start is higher than end
    if (form.startYear > form.endYear) {
        const start = form.startYear;
        form.startYear = form.endYear;
        form.endYear = start;
    }

    url += `?$filter=year ge ${form.startYear} and year le ${form.endYear}`;

    if (form.field && form.operator && form.value) {
        url += ` ${form.logicalOperator} Results/any(a: a/${form.field} ${form.operator} '${form.value}')`;
    }
        
    queryArticles(url, form.value);
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
                if (resultFilter && !filterResults(article, result, resultFilter))
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
        } else if (typeof(value) == "string" && value.toUpperCase().includes(resultFilter.toUpperCase())) {
            hasValue = true;
            return;
        }
    });

    if (hasValue)
        return true

    Object.values(result).forEach(value => {
        if (value && value.toUpperCase().includes(resultFilter.toUpperCase())) {
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
        btn=btn.children[1];
        btn=btn.children[3];
        btn.id="query-"+(lastRowNum+1);
        table.children[0].appendChild(tr);
    } catch(err) {
        table.children[0].appendChild(queryTemplate);
    }
    console.log(">>> "+table.children[0]);
}

function gotoBottom(id) {
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

var queryTemplate = document.getElementById("query-0");

//Exporting modules for testing.
try{
    module.exports = {
        
    };
}catch(err){}
