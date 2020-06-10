// get an article in queue
  //  fetch('https://app-submissions-ae-aut.azurewebsites.net/api/moderation', { method: 'get' }).then(function (data) {
  // }).then(function (data) {
  //   var articles = JSON.parse(data);
  //   data.forEach(data => {
  //     articles.push({id: id, popReceipt: popReceipt});
  //   });
  //   queueTable.articles = articles;
  //   queueTable.isBusy = false;
  // });

const queueTable = new Vue({
  el: '#queue',
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
        label: "Title",
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
      },
      {
        key: "moderation",
        label:"Moderation"
      
      }]
  }
});



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
        label: "Title",
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
  }
});
