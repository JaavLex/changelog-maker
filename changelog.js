let featureKwList = [];
let fixesKwList = [];
let defaultfeatlist = ['feat', 'FEAT', 'feature', 'FEATURE'];
let defaultfixlist = ['fix', 'FIX', 'hotfix', 'HOTFIX'];

function localStorageManager(pageload) {
  if (pageload) {
    document.getElementById("urlhtml").value = localStorage.getItem('tacticsch-chgmaker-url-storage');
    document.getElementById("apitoken").value = localStorage.getItem('tacticsch-chgmaker-token-storage');
    document.getElementById("beforedate").value = localStorage.getItem('tacticsch-chgmaker-before-storage');
    document.getElementById("afterdate").value = localStorage.getItem('tacticsch-chgmaker-after-storage');
    if (localStorage.getItem('tacticsch-chgmaker-feature-keywords') != null) {
      featureKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-feature-keywords'));
      document.getElementById("featurekwhtml").innerHTML = "* " + featureKwList.join("<br>* ");
      console.log(featureKwList);
    } else {
      featureKwList = defaultfeatlist;
      document.getElementById("featurekwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + featureKwList.join("<br>* ") + "<br>-------------<br>";
    }
    if (localStorage.getItem('tacticsch-chgmaker-fix-keywords') != null) {
      fixesKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-fix-keywords'));
      document.getElementById("fixkwhtml").innerHTML = "* " + fixesKwList.join("<br>* ");
      console.log(fixesKwList);
    } else {
      fixesKwList = defaultfixlist;
      document.getElementById("fixkwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + fixesKwList.join("<br>* ") + "<br>-------------<br>";
    }
  } else {
    localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value );
    localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value );
    localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value );
    localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value );
  }
}

function keywordAdder(feature) {
  if (feature) {
    featureKwList = defaultfeatlist;
    featureKwList.push(document.getElementById("featkwinput").value);
    localStorage.setItem('tacticsch-chgmaker-feature-keywords', JSON.stringify(featureKwList) );
    featureKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-feature-keywords'));
    document.getElementById("featurekwhtml").innerHTML = "* " + featureKwList.join("<br>* ");
  } else {
    fixesKwList = defaultfixlist;
    fixesKwList.push(document.getElementById("fixkwinput").value);
    localStorage.setItem('tacticsch-chgmaker-fix-keywords', JSON.stringify(fixesKwList) );
    fixesKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-fix-keywords'));
    document.getElementById("fixkwhtml").innerHTML = "* " + fixesKwList.join("<br>* ");
  }
}

function keywordClearer(feature) {
  if (feature) {
    localStorage.removeItem('tacticsch-chgmaker-feature-keywords');
    featureKwList = defaultfeatlist;
    localStorage.setItem('tacticsch-chgmaker-feature-keywords', JSON.stringify(featureKwList) );
    document.getElementById("featurekwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + featureKwList.join("<br>* ") + "<br>-------------<br>";
  } else {
    localStorage.removeItem('tacticsch-chgmaker-fix-keywords');
    fixesKwList = defaultfixlist;
    localStorage.setItem('tacticsch-chgmaker-fix-keywords', JSON.stringify(fixesKwList) );
    document.getElementById("fixkwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + fixesKwList.join("<br>* ") + "<br>-------------<br>";
  }
}

function clearFields() {
  document.getElementById("urlhtml").value = "";
  document.getElementById("apitoken").value = "";
  document.getElementById("beforedate").value = "";
  document.getElementById("afterdate").value = "";
  localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value );
  localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value );
  localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value );
  localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value );
}

async function getCommits(repoUrl, nbCommits, apiKey, beforeDate, afterDate) {
  const repoCommits = [];
  let dateParameters = "";
  let totalPage = 0;

  if (beforeDate != "" && afterDate != "") {
    dateParameters = `&since=${afterDate}&until=${beforeDate}`;
  } else if (afterDate != "") {
    dateParameters = `&since=${afterDate}&until=${beforeDate}`;
  } else if (beforeDate != "") {
    dateParameters = `&until=${beforeDate}`;
  }

  const headersRequest = await fetch(repoUrl+"1",{
    method: "GET",
    headers: {
      Authorization: `token ${apiKey}` 
    },
  });

  let headerLink = headersRequest.headers.get("link");
  if (headerLink) {
    rgxmatch = headerLink.match(/&page=(\d*)>; rel="last"/);
    totalPage = Math.ceil(rgxmatch[1]/nbCommits);
  }

  for (let i = 1; i <= totalPage; i++) {
    const repoContent = await fetch(repoUrl+nbCommits+"&page="+i+dateParameters,{
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
  document.getElementById("bodyhtml").innerHTML = "<center><img src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/source.gif'></img></center>";

  const urlField = document.getElementById("urlhtml").value.toString();
  const apiField = document.getElementById("apitoken").value.toString();
  const beforeField = document.getElementById("beforedate").value.toString();
  const afterField = document.getElementById("afterdate").value.toString();
  const rawCommits = await getCommits("https://api.github.com/repos/" + urlField + "/commits?per_page=", "100", apiField, beforeField, afterField);
  const commitMessages = rawCommits.map((item) => item.commit.message.split("\n")[0] + "- [[" + item.sha.substring(0, 8) + "](" + item.url + ")]");
  const features = [];
  const fixes = [];

  // new RegExp(`^\[?${balise}[\]|:]`, "g")

  commitMessages.forEach(function callbackFn(commit) { 
    featureKwList.forEach(function callbackFn(balise) {
      if (commit.match(new RegExp(`^\\[?${balise}[\\]|:]`, "g"))) {
        features.push(commit.replace(new RegExp(`^\\[?${balise}[\\]|:]`),'* '));
      } 
    });
  });

  commitMessages.forEach(function callbackFn(commit) { 
    fixesKwList.forEach(function callbackFn(balise) {
      if (commit.match(new RegExp(`^\\[?${balise}[\\]|:]`, "g"))) {
        fixes.push(commit.replace(new RegExp(`^\\[?${balise}[\\]|:]`),'* '));
      } 
    });
  });

  let newBody = '<pre><h1># Changelog - ' + urlField + "</h1>";
  if (beforeField != "" && afterField != "") {
    newBody += `<h3>### Commits between ${beforeField} and ${afterField}</h3>`;
  } else if (afterField != "") {
    newBody += `<h3>### Commits before ${beforeField}</h3>`;
  } else if (beforeField != "") {
    newBody += `<h3>### Commits after ${afterField}</h3>`;
  }
  newBody += `<h2>## New features</h2>`;
  newBody += features.join("<br><br>");
  newBody += `<h2>## Bug fixes</h2>`;
  newBody += fixes.join("<br><br>");
  document.getElementById("bodyhtml").innerHTML = newBody;
}


