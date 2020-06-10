console.log(JSON.stringify(toJSON('@article{sample1,title={sample title}}')));
bibFile();

function bibFile(){
    document.getElementById("bibtex")
    .addEventListener('change', function() { 
              
        var fr=new FileReader(); 
        fr.onload=function(){ 
           console.log(JSON.stringify(toJSON(fr.result)[0]));
           var JsonBib = toJSON(fr.result)[0];

           document.getElementById("title").value=JsonBib.entryTags.TITLE;
           document.getElementById("author").value=JsonBib.entryTags.AUTHOR;
           document.getElementById("journal").value=JsonBib.entryTags.JOURNAL;
           document.getElementById("year").value=JsonBib.entryTags.YEAR;
           document.getElementById("doi").value=JsonBib.entryTags.DOI;
           document.getElementById("volume").value=JsonBib.entryTags.VOLUME;
           document.getElementById("pages").value=JsonBib.entryTags.PAGES;
           document.getElementById("journalIssue").value=JsonBib.entryTags.JOURNALISSUE;
           
        } 
          
        fr.readAsText(this.files[0]); 
    }) 
  }

function submitArticle(){
    
    document.getElementById("doi").classList.remove("is-invalid");
    if(document.getElementById("doi").value==""){
        document.getElementById("doi").classList.add("is-invalid");
        return;
    }
    console.log(new FormData(form));
    
    var data='{"author": "'+document.getElementById("author").value+'","title": "'+
    document.getElementById("title").value+'","journal": "'+document.getElementById("journal").value+'","year": '+
    document.getElementById("year").value+',"journalIssue": '+document.getElementById("journalIssue").value+',"volume": '+
    document.getElementById("volume").value+',"pages": "'+document.getElementById("pages").value+'","doi": "'+document.getElementById("doi").value+'"}';

    (async () => {
        const rawResponse = await fetch('https://app-submissions-ae-aut.azurewebsites.net/api/moderation', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: data
        });
        const content = await rawResponse.json();
      
        console.log(content);
    })();
}