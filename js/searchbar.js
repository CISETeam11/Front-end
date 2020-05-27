//:: Handles searchbar input :://
const URL_ATRICLES = "https://app-articles-ae-aut.azurewebsites.net/api/articles";


document.onload=searchbarOnEnter();

//A fuction to handle pressing enter while focues on search bar//
function searchbarOnEnter() {
    document.getElementById('searchbar').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            handleSearchbar();
            return false;
        }
    }
}
//A function to get input from searchbar to get results from API//
function handleSearchbar() {
    var input = document.getElementsByClassName('search-input')[0].value;
    var articles=[];
    if (input != "") {
        input = input.toUpperCase();
        var client = new HttpClient();
        client.get(URL_ATRICLES, function (response) {
            var articlesJSON = JSON.parse(response);
            articlesJSON.forEach(element => {
                element.author = element.author.toUpperCase();
                if (element.author.indexOf(input) !== -1) {
                    articles.push(element);
                }else{
                    element.title=element.title.toUpperCase();
                    if(element.title.indexOf(input) !== -1){
                        articles.push(element);
                    }
                }
            });
            console.log(articles);
            return articles;
        });
    }
}

function btnSearch() {
    var data=handleSearchbar();// Can access the filtered atricles from here.
    if(data.length!=0){
    //filter more for date-range
    //filter more for SE methods
    }else{
        console.log("no articles were found");
    }

}


//btnSearch()

//var articlesJSON = JSON.parse(httpGet(""));
//console.log(articlesJSON[0].author);