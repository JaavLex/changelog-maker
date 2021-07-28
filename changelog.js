const featureKwList = ['feat', 'feature'];
const fixesKwList = ['fix', 'hotfix', '\HOTFIX'];

function localStorageManager(pageload) {
  if (pageload == true) {
    document.getElementById("urlhtml").value = localStorage.getItem('tacticsch-chgmaker-url-storage');
    document.getElementById("nbpageshtml").value = localStorage.getItem('tacticsch-chgmaker-nb-storage');
    document.getElementById("apitoken").value = localStorage.getItem('tacticsch-chgmaker-token-storage');
    document.getElementById("beforedate").value = localStorage.getItem('tacticsch-chgmaker-before-storage');
    document.getElementById("afterdate").value = localStorage.getItem('tacticsch-chgmaker-after-storage');
  } else {
    localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value );
    localStorage.setItem('tacticsch-chgmaker-nb-storage', document.getElementById("nbpageshtml").value );
    localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value );
    localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value );
    localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value );
  }
}

async function getCommits(repoUrl, apiKey, numberPage, beforeDate, afterDate) {
  const repoCommits = [];
  let dateParameters = "";

  if (beforeDate != "" && afterDate != "") {
    dateParameters = `&since=${afterDate}&until=${beforeDate}`;
  };

  for (let i = 1; i < numberPage; i++) {
    const repoContent = await fetch(repoUrl+"?page="+i+dateParameters,{
      method: "GET",
      headers: {
        Authorization: `token ${apiKey}` 
      },
    });
    const jsonCommits = await repoContent.json();
    repoCommits.push(...jsonCommits);
  };

  return repoCommits;
}

async function sortCommits() {
  const urlField = document.getElementById("urlhtml").value.toString();
  const nbpageField = document.getElementById("nbpageshtml").value.toString();
  const apiField = document.getElementById("apitoken").value.toString();
  const beforeField = document.getElementById("beforedate").value.toString();
  const afterField = document.getElementById("afterdate").value.toString();

  const rawCommits = await getCommits("https://api.github.com/repos/" + urlField + "/commits", apiField, nbpageField, beforeField, afterField);
  const commitMessages = rawCommits.map((item) => item.commit.message + " - [" + item.sha.substring(0, 5) + "](" + item.url + ")");
  const features = [];
  const fixes = [];

  commitMessages.forEach(function callbackFn(commit) { 
    featureKwList.forEach(function callbackFn(balise) {
      if (commit.match(new RegExp(`(^.{0,10}(${balise}).{0,1})`, "g"))) {
        features.push(commit.replace(balise,'* '));
      } 
    });
  });

  commitMessages.forEach(function callbackFn(commit) { 
    fixesKwList.forEach(function callbackFn(balise) {
      if (commit.match(new RegExp(`(^.{0,10}(${balise}).{0,1})`, "g"))) {
        fixes.push(commit.replace(balise,'* '));
      } 
    });
  });

  let newBody = '<pre><h1># Changelog - ' + urlField + "</h1>";
  newBody += `<h2>## New features</h2>`;
  newBody += features.join("<br><br>");
  newBody += `<h2>## Bug fixes</h2>`;
  newBody += fixes.join("<br><br>");
  document.getElementById("bodyhtml").innerHTML = newBody;
}


