let featureKwList = [];
let fixesKwList = [];
let refactorKwList = [];
let othersKwList = [];
let othersSelectionList = [];
let defaultfeatlist = ['feat', 'FEAT', 'feature', 'FEATURE'];
let defaultfixlist = ['fix', 'FIX', 'hotfix', 'HOTFIX'];
let defaultreflist = ['ref', 'REF', 'refactor', 'REFACTOR'];
let defaultotherslist = ['bump', 'BUMP'];

function localStorageManager(pageload) {
  if (pageload) {
    document.getElementById("urlhtml").value = localStorage.getItem('tacticsch-chgmaker-url-storage');
    document.getElementById("apitoken").value = localStorage.getItem('tacticsch-chgmaker-token-storage');
    document.getElementById("beforedate").value = localStorage.getItem('tacticsch-chgmaker-before-storage');
    document.getElementById("afterdate").value = localStorage.getItem('tacticsch-chgmaker-after-storage');
    if (localStorage.getItem('tacticsch-chgmaker-feature-keywords') != null) {
      featureKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-feature-keywords'));
      document.getElementById("featurekwhtml").innerHTML = "* " + featureKwList.join("<br>* ");
    } else {
      featureKwList = defaultfeatlist;
      document.getElementById("featurekwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + featureKwList.join("<br>* ") + "<br>-------------<br>";
    }
    if (localStorage.getItem('tacticsch-chgmaker-fix-keywords') != null) {
      fixesKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-fix-keywords'));
      document.getElementById("fixkwhtml").innerHTML = "* " + fixesKwList.join("<br>* ");
    } else {
      fixesKwList = defaultfixlist;
      document.getElementById("fixkwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + fixesKwList.join("<br>* ") + "<br>-------------<br>";
    }
    if (localStorage.getItem('tacticsch-chgmaker-ref-keywords') != null) {
      refactorKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-ref-keywords'));
      document.getElementById("refkwhtml").innerHTML = "* " + refactorKwList.join("<br>* ");
    } else {
      refactorKwList = defaultreflist;
      document.getElementById("refkwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + refactorKwList.join("<br>* ") + "<br>-------------<br>";
    }
    if (localStorage.getItem('tacticsch-chgmaker-others-keywords') != null) {
      othersKwList = JSON.parse(localStorage.getItem('tacticsch-chgmaker-others-keywords'));
      document.getElementById("otherskwhtml").innerHTML = "* " + othersKwList.join("<br>* ");
    } else {
      othersKwList = defaultotherslist;
      document.getElementById("otherskwhtml").innerHTML = "-- DEFAULT --<br>" + "* " + othersKwList.join("<br>* ") + "<br>-------------<br>";
    }
  } else {
    localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value );
    localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value );
    localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value );
    localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value );
  }
}

function addKeywordLocalStorage(localStorageField, keywordList, defaultList, htmlField, inputField) {
  keywordList = defaultList;
  keywordList.push(document.getElementById(inputField).value);
  localStorage.setItem(localStorageField, JSON.stringify(keywordList) );
  keywordList = JSON.parse(localStorage.getItem(localStorageField));
  document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ");
}

function keywordAdder(commitType) {
  switch (commitType) {
    case 1:
      addKeywordLocalStorage('tacticsch-chgmaker-feature-keywords', featureKwList, defaultfeatlist, "featurekwhtml", "featkwinput");
      break;
    case 2:
      addKeywordLocalStorage('tacticsch-chgmaker-fix-keywords', fixesKwList, defaultfixlist, "fixkwhtml", "fixkwinput");
      break;
    case 3:
      addKeywordLocalStorage('tacticsch-chgmaker-ref-keywords', refactorKwList, defaultreflist, "refkwhtml", "refkwinput");
      break;
    case 4:
      addKeywordLocalStorage('tacticsch-chgmaker-others-keywords', othersKwList, defaultotherslist, "otherskwhtml", "otherskwinput");
      break;
    default:
      console.log("ERROR: Unknown commit type");
      break;
  }
}

function clearKeywordLocalStorage(localStorageField, keywordList, defaultList, htmlField) {
  localStorage.removeItem(localStorageField);
  keywordList = defaultList;
  localStorage.setItem(localStorageField, JSON.stringify(featureKwList) );
  document.getElementById(htmlField).innerHTML = "-- DEFAULT --<br>" + "* " + keywordList.join("<br>* ") + "<br>-------------<br>";
}

function keywordClearer(commitType) {
  switch (commitType) {
    case 1:
      clearKeywordLocalStorage('tacticsch-chgmaker-feature-keywords', featureKwList, defaultfeatlist, "featurekwhtml");
      break;
    case 2:
      clearKeywordLocalStorage('tacticsch-chgmaker-fix-keywords', fixesKwList, defaultfixlist, "fixkwhtml");
      break;
    case 3:
      clearKeywordLocalStorage('tacticsch-chgmaker-ref-keywords', refactorKwList, defaultreflist, "refkwhtml");
      break;
    case 4:
      clearKeywordLocalStorage('tacticsch-chgmaker-others-keywords', othersKwList, defaultotherslist, "otherskwhtml");
      break;
    default:
      console.log("ERROR: Unknown commit type");
      break;
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

  const headersRequest = await fetch(repoUrl+"1"+dateParameters,{
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
    console.log("Loading...");
    const jsonCommits = await repoContent.json();
    repoCommits.push(...jsonCommits);
  };

  return repoCommits;
}

async function sortCommits() {
  document.getElementById("bodyhtml").innerHTML = "<center><img src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/source.gif'></img></center>";

  const urlField = document.getElementById("urlhtml").value.toString();
  const apiField = document.getElementById("apitoken").value.toString();
  const afterField = document.getElementById("afterdate").value.toString();
  const beforeField = document.getElementById("beforedate").value.toString();
  const rawCommits = await getCommits("https://api.github.com/repos/" + urlField + "/commits?per_page=", "100", apiField, beforeField, afterField);
  const commitMessages = rawCommits.map((item) => "[[" + item.sha.substring(0, 8) + "](" + item.html_url + ")] - " + item.commit.message.split("\n")[0]);
  const features = [];
  const fixes = [];
  const refs = [];
  const others = [];
  const othersRaw = [];

  function baliseRemover(keywordList, finalList) {
    commitMessages.forEach(function callbackFn(commit) { 
      keywordList.forEach(function callbackFn(balise) {
        if (commit.match(new RegExp(`(?!\\)\\] - )\\[?${balise}[\\]|:]`, "g"))) {
          if (document.getElementsByName('yesNoBalises')[1].checked) {
            finalList.push(commit.replace(new RegExp(`(?!\\)\\] - ) \\[?${balise}[\\]|:]`, "g"),''));
          } else {
            finalList.push(commit);
          }
        } 
      });
    });
  }

  baliseRemover(featureKwList, features);
  baliseRemover(fixesKwList, fixes);
  baliseRemover(refactorKwList, refs);

  othersSelectionList = othersSelectionList.concat(featureKwList);
  othersSelectionList = othersSelectionList.concat(fixesKwList);
  othersSelectionList = othersSelectionList.concat(refactorKwList);    
  if (document.getElementsByName('yesNoMerges')[1].checked) {
    othersSelectionList.concat(["Merge", "merge", "MERGE"]);
  }

  commitMessages.forEach(function callbackFn(commit) {
    let noMatch = 0; 
    for (let i = 0; i < othersSelectionList.length; i++) {
      if (!commit.match(new RegExp(`(?!\\)\\] - )\\[?${othersSelectionList[i]}[\\]|:]`, "g"))) {
        noMatch++;
      }
    }
    if (noMatch === othersSelectionList.length) {
      othersRaw.push(commit);
    }
  });

  othersRaw.forEach(function callbackFn(commit) { 
    if (document.getElementsByName('yesNoBalisesOthers')[1].checked) {
      othersKwList.forEach(function callbackFn(balise) {
        if (commit.match(new RegExp(`(?!\\)\\] - )[[Mm]erge|\[merge\]]`, "g"))) {
          if (document.getElementsByName('yesNoMerges')[0].checked) {
            others.push(commit.replace(new RegExp(`(?!\\)\\] - ) \\[?${balise}[\\]|:]`, "g"),''));
          }
        } else {
          others.push(commit)
        }
      });
    } else {
      if (commit.match(new RegExp(`(?!\\)\\] - )[[Mm]erge|\[merge\]]`, "g"))) {
        if (document.getElementsByName('yesNoMerges')[0].checked) {
          others.push(commit)
        }
      } else {
        others.push(commit)
      }
    }
  });

  let newBody = '<pre><h1># Changelog - ' + urlField + "</h1>";
  if (beforeField != "" && afterField != "") {
    newBody += `<h3>> Commits between ${beforeField} and ${afterField}</h3>`;
  } else if (afterField != "") {
    newBody += `<h3>> Commits since ${afterField}</h3>`;
  } else if (beforeField != "") {
    newBody += `<h3>> Commits until ${beforeField}</h3>`;
  }
  newBody += `<h2>## New features</h2>`;
  newBody += features.join("<br><br>");
  newBody += `<h2>## Bug fixes</h2>`;
  newBody += fixes.join("<br><br>");
  newBody += `<h2>## Code Refactors</h2>`;
  newBody += refs.join("<br><br>");
  newBody += `<h2>## Other types of commits</h2>`;
  newBody += others.join("<br><br>");
  document.getElementById("bodyhtml").innerHTML = newBody;
}