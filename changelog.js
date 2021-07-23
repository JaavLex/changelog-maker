// Version pour lister les détails des commits du projet zuzu59/NodeMCU_Lua
// zf200825.1158
var page = 1;
var previousRequest;

console.log("Start");

function changeForward(prevOrNext) {
  if (prevOrNext == true) {
    page++;
    loadPage(page)
  } else {
    page--;
    loadPage(page)
  }
}

function loadPage(nextorprevious) {
  var myRequest = new Request(`https://api.github.com/repos/GinierClasses/holydraw/commits?page=${nextorprevious}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    });

    console.log(myRequest);

    if (myRequest == null) {
      alert(`Page N#${page} doesn't exist`)
    } else {
      fetch(myRequest)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (previousRequest == data) {
          alert(`Page N#${page} doesn't exist`)
        } else {
          let newBody = '<h1>NodeMCU_Lua 1640</h1>';
          newBody += '<a href="https://github.com/zuzu59/NodeMCU_Lua" >https://github.com/zuzu59/NodeMCU_Lua</a><br>';
          newBody += `<button onclick="changeForward(false)">Previous</button> PAGE N#${page} <button onclick="changeForward(true)">Next</button>`;
          data.forEach((item, i) => {
            newBody += '<h3>' + item.commit.author.date + '</h3>';
            newBody += '<p>' + item.commit.message + '</p>';
          });
          document.getElementById("bodyhtml").innerHTML = newBody;

          previousRequest = data;
        }
      })
      .catch(function(err) {
        console.warn('Something went wrong.', err);
      });
    }
}
