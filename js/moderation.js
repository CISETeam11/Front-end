
const queueForm = new Vue({
  el: '#queue',
  data: {
    articles: [],
    titleError: '',
    authorError: '',
    yearError: '',
    doiError: ''
  },
  mounted: function () {
    this.getQueue();
  },
  methods: {
    acceptArticle: function () {
      var title = this.articles[0].article.title;
      var author = this.articles[0].article.author;
      var journal = this.articles[0].article.journal;
      var year = this.articles[0].article.year;
      var doi = this.articles[0].article.doi;
      var volume = this.articles[0].article.volume;
      var pages = this.articles[0].article.pages;
      var journalIssue = this.articles[0].article.journalIssue;
      var id = this.articles[0].id;
      var popReceipt = this.articles[0].popReceipt;
      var data = '{"article":{ "author": "' + author + '", "title": "' + title + '", "journal": "' + journal + '", "year": ' + year + ', "journalIssue": ' + journalIssue + ', "volume": ' + volume + ', "pages": "' + pages + '", "doi": "' + doi + '"}, "id": "' + id + '","popReceipt":"' + popReceipt + '"} ';

      // validate title, author, year, and doi
      if (title == '' || title == null || author == '' || author == null || year == '' || year == null || doi == '' || doi == null) {
        if (title == '' || title == null) {
          this.titleError = '1px solid #dc3545';
        }
        if (author == '' || author == null) {
          this.authorError = '1px solid #dc3545';
        }
        if (year == null || year == '') {
          this.yearError = '1px solid #dc3545';
        }
        if (doi == '' || doi == null) {
          this.doiError = '1px solid #dc3545';
        }
      } else {
        fetch('https://app-submissions-ae-aut.azurewebsites.net/api/analysis', {
          method: 'POST',
          body: data,
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        }).then(function () {
          // pop up alert, then reload page
          alert('Accept Successfully!'); window.location.href = document.referrer;
        });
      }
    },
    deleteArticle: function (id, popReceipt) {
      console.log('{"id": "' + id + '","popReceipt":"' + popReceipt + '"}');
      fetch('https://app-submissions-ae-aut.azurewebsites.net/api/moderation', {
        method: 'DELETE',
        body: '{"id": "' + id + '","popReceipt":"' + popReceipt + '"}',
        headers: new Headers({
          'Accept': '*',
          'Content-Type': 'application/json'
        })
      }
      ).then(function () {
        // pop up alert, then reload page
        alert('Delete Successfully!'); window.location.href = document.referrer;
      });
    },
    getQueue: function () {
      // get an article in queue
      (async () => {
        fetch('https://app-submissions-ae-aut.azurewebsites.net/api/moderation', { method: 'get' }).then(function (data) {
          return data.json();
        }).then(function (data) {
          var queueArticles = [];
          queueArticles.push(data);
          queueForm.articles = queueArticles;

        })
      })();
    }
  }
});


const moderationTable = new Vue({
  el: '#moderation',
  data: {
    isBusy: true,
    articles: [],
    fields:
      [{
        key: "Title",
        label: "Title",
      }, {
        key: "Author",
        label: "Author",
      },
      {
        key: "Journal",
        label: "Journal",
      },
      {
        key: "Year",
        label: "Year",
      },
      {
        key: "JournalIssue",
        label: "JournalIssue",
      },
      {
        key: "Volume",
        label: "Volume",
      },
      {
        key: "Pages",
        label: "Pages",
      },
      {
        key: "Doi",
        label: "Doi",
      }]
  },
  mounted: function () {
    this.getSubActciel();
  },
  methods: {
    getSubActciel: function () {
      // list all articles that need moderation
      (async () => {
        await fetch('https://app-submissions-ae-aut.azurewebsites.net/api/moderation/submissions', { method: 'get' }).then(function (data) {
          return data.json();
        }).then(function (data) {
          var articles = [];
          data.forEach(data => {
            articles.push(JSON.parse(data.asString));
          });
          moderationTable.articles = articles;
          moderationTable.isBusy = false;
        })
      })();
    }
  }
});
