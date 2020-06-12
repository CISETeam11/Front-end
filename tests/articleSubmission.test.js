const SUBMISSIONS_URL = 'https://app-submissions-ae-aut.azurewebsites.net/api/moderation';
test('Article submission test', ()=>{
    var testData='{"author": "testAuthor","title": "testTitle","journal": "testJournal","year": 2007,"journalIssue": 2,"volume": 3,"pages": "33-38","doi": "10.1109/MS.2008.34"}';
    (async () => {
        await fetch(SUBMISSIONS_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: testData
      }).then(function (response) {
          expect(response.json()).not.toBeNull()
      })
    })();
})

