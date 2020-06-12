//Handles atricle submissions.
const SUBMISSIONS_URL = 'https://app-submissions-ae-aut.azurewebsites.net/api/moderation';

//A function to handle uploading bibfile then parsing it to input fields.
function bibFile() {
  document.getElementById("bibtex")
    .addEventListener('change', function () {

      var fr = new FileReader();
      fr.onload = function () {
        var JsonBib = toJSON(fr.result)[0];

        document.getElementById("title").value = JsonBib.entryTags.title;
        var title = JsonBib.entryTags.author.split('{').join('');
        title = title.split('}').join('');
        document.getElementById("author").value = title;
        document.getElementById("journal").value = JsonBib.entryTags.journal;
        document.getElementById("year").value = JsonBib.entryTags.year;
        document.getElementById("doi").value = JsonBib.entryTags.doi;
        document.getElementById("volume").value = JsonBib.entryTags.volume;
        document.getElementById("pages").value = JsonBib.entryTags.pages;
        document.getElementById("journalIssue").value = JsonBib.entryTags.number;

      }

      fr.readAsText(this.files[0]);
    })
}

//A function to get users inputs from the submit form as a JSON.
function serializeFormToJson(formData) {
  var unindexed_array = formData.serializeArray();

  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    if (n.value != '') {
      if (n.name == 'year' || n.name == 'volume' || n.name == 'journalIssue') {
        indexed_array[n.name] = parseInt(n.value);
      } else {
        indexed_array[n.name] = n.value;
      }
    }
  });

  return JSON.stringify(indexed_array);
}

//A function to show user form feedback.
function showMessage(str, type) {
  var message = document.getElementById("message");
  message.style.display = "none";
  message.classList.remove("alert-success");
  message.classList.remove("alert-danger");

  if (type == "error") {
    message.classList.add("alert-danger");
  } else {
    message.classList.add("alert-success");
  }
  message.innerHTML = str;
  message.style.display = "block";
}

function submitArticle() {
  showMessage("");
  document.getElementById("doi").classList.remove("is-invalid");

  if (document.getElementById("doi").value == "") {
    showMessage("DOI cannot be empty!", "error");
    document.getElementById("doi").classList.add("is-invalid");
    return;
  }

  fetch(SUBMISSIONS_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: serializeFormToJson($("#form"))
  }).then(function (response) {
    //console.log(response.status);
    if (!response.ok) {
      showMessage("Article submission was unsuccessful", "error");
    } else {
      showMessage("Article submission was successful.");
    }
    return response.json();
  })
}

try {
  bibFile();
} catch (error) {
  
}

//Exporting modules for testing.
try {
  module.exports = {
    fun: fun
  }
} catch (err) { };