var userFormEl = document.querySelector('#coderForm');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a GitHub username');
  }
};

var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getFeaturedRepos(language);

    repoContainerEl.textContent = '';
  }
};

var getUserRepos = function (user) {
  var apiUrl = 'https://api.github.com/users/' + user + '/repos';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, user);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

var getFeaturedRepos = function (language) {
  var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

var coderForm = document.getElementById("coderForm");
var codersContainer = document.querySelector(".coders");

var nameInput = coderForm["username"];
var coders = JSON.parse(localStorage.getItem("coders")) || [];

var addCoder = (name) => {
  coders.push({
    name
  });

  localStorage.setItem("coders", JSON.stringify(coders));

  return { name };
};

var createCoderElement = ({ name }) => {
  // Create elements
  var coderDiv = document.createElement("div");
  var coderName = document.createElement("h2");


  // Fill the content
  coderName.innerText =  name;


  // Add to the DOM
  coderDiv.append(coderName);
  codersContainer.appendChild(coderDiv);

  codersContainer.style.display = coders.length === 0 ? "none" : "flex";
};

codersContainer.style.display = coders.length === 0 ? "none" : "flex";

coders.forEach(createCoderElement);

coderForm.onsubmit = e => {
  e.preventDefault();

  var newCoder = addCoder(
    nameInput.value,

  );

  createCoderElement(newCoder);

  nameInput.value = "";

};



userFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
