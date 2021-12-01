var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos"
       
    //make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if(response.ok){
        response.json().then(function(data) {
            displayRepos(data, user);
            //console.log(data);
        });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    /* .catch is the FETCH API's way of handling network errors. the request may find it's destination URL and attempt
    get the data in question (returned into the then() method) or if the request fails that error will be sent to the .catch() method */
    .catch(function(error){
        // notice this '.catch()' getting chained onto the end of the '.then() method
        alert("Unable to connect to GitHub");
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    //get value from user input element and set to variable username and trim any leading or trailing space
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        //this clears the input form
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
}

var displayRepos = function(repos, searchTerm){
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login+ "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold the repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container: append span to the div
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if curren repo has issues or not 
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
            } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
            }

            // append to container
            repoEl.appendChild(statusEl);

        

        // append container to the dom: append the div to the dom
        repoContainerEl.appendChild(repoEl);
    }
}
userFormEl.addEventListener("submit", formSubmitHandler);