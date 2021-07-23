// Version pour lister les détails des commits du projet zuzu59/NodeMCU_Lua
// zf200825.1158
//

console.log("Start");
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
document.getElementById("startbutton").onclick = function() {
  console.log("TEST");
  loadPage(1)
};

page = 1;

document.getElementById("nextbutton").onclick = function() {
  page++;
  loadPage(page)
};

document.getElementById("previousbutton").onclick = function() {
  page--;
  loadPage(page)
};

function loadPage(nextorprevious) {
  const myRequest = new Request(`https://api.github.com/repos/GinierClasses/holydraw/commits?page=${nextorprevious}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    });
  
    fetch(myRequest)
    .then(function(response) {
      // The API call was successful!
      return response.json();
    })
    .then(function(data) {
      let newBody = '<h1>NodeMCU_Lua 1640</h1>';
      newBody += '<a href="https://github.com/zuzu59/NodeMCU_Lua" >https://github.com/zuzu59/NodeMCU_Lua</a><br>';
      newBody += `<button id="previousbutton">Previous</button> PAGE N#${page} <button id="nextbutton">Next</button>`;
      data.forEach((item, i) => {
        newBody += '<h3>' + item.commit.author.date + '</h3>';
        newBody += '<p>' + item.commit.message + '</p>';
      });
      document.body.innerHTML = newBody;
    })
    .catch(function(err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
}
