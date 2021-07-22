// Version pour lister les détails des commits du projet zuzu59/NodeMCU_Lua
// zf200825.1158
//
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
page = 1;

document.getElementById("startbutton").onclick = function() {loadPage(1)}

document.getElementById("nextbutton").onclick = function() {loadPage(page)};

document.getElementById("previousbutton").onclick = function() {loadPage(page)};

function loadPage(nextorprevious) {
  const myRequest = new Request(`https://api.github.com/repos/GinierClasses/holydraw/commits?page=${nextorprevious}`, {
    method: 'GET',
    //mode: 'cors', // no-cors, *cors, same-origin
    //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      //'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      //'Accept': 'application/vnd.github.cloak-preview+json'
    },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
  
    fetch(myRequest)
    .then(function(response) {
      // The API call was successful!
      return response.json();
    })
    .then(function(data) {
      // This is the JSON from our response
      // console.log(data);
      let newBody = '<h1>NodeMCU_Lua 1640</h1>';
      newBody += '<a href="https://github.com/zuzu59/NodeMCU_Lua" >https://github.com/zuzu59/NodeMCU_Lua</a>';
  
      data.forEach((item, i) => {
        // console.log('\n');
        // console.log(item.commit.author.date);
        // console.log(item.commit.message);
        newBody += '<h3>' + item.commit.author.date + '</h3>';
        newBody += '<p>' + item.commit.message + '</p>';
      });

      newBody += '<button id="previousbutton">Previous</button> <button id="nextbutton">Next</button>';
      document.body.innerHTML = newBody;
    })
    .catch(function(err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
}

// loadPage(page);
