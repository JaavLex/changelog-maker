let featureKwList = [];
let fixesKwList = [];
let refactorKwList = [];
let othersSelectionList = [];
let defaultfeatlist = ['feat', 'FEAT', 'feature', 'FEATURE'];
let defaultfixlist = ['fix', 'FIX', 'hotfix', 'HOTFIX'];
let defaultreflist = ['ref', 'REF', 'refactor', 'REFACTOR'];

function loadListLocalStorage(localStorageField, defaultList, htmlField) {
  if (localStorage.getItem(localStorageField) != null) {
    keywordList = JSON.parse(localStorage.getItem(localStorageField));
    document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ");
    return keywordList;
  } else {
    keywordList = defaultList;
    document.getElementById(htmlField).innerHTML = "-- DEFAULT --<br>" + "* " + keywordList.join("<br>* ") + "<br>-------------<br>";
    localStorage.setItem(localStorageField, JSON.stringify(keywordList) );
    return keywordList;
  }
}

function localStorageManager(pageload) {
  if (pageload) {
    document.getElementById("urlhtml").value = localStorage.getItem('tacticsch-chgmaker-url-storage');
    document.getElementById("apitoken").value = localStorage.getItem('tacticsch-chgmaker-token-storage');
    document.getElementById("beforedate").value = localStorage.getItem('tacticsch-chgmaker-before-storage');
    document.getElementById("afterdate").value = localStorage.getItem('tacticsch-chgmaker-after-storage');
    featureKwList = loadListLocalStorage('tacticsch-chgmaker-feature-keywords', defaultfeatlist, "featurekwhtml");
    fixesKwList = loadListLocalStorage('tacticsch-chgmaker-fix-keywords', defaultfixlist, "fixkwhtml");
    refactorKwList = loadListLocalStorage('tacticsch-chgmaker-ref-keywords', defaultreflist, "refkwhtml");
  } else {
    localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value );
    localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value );
    localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value );
    localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value );
  }
}

function addKeywordLocalStorage(localStorageField, defaultList, htmlField, inputField) {
  keywordList = defaultList;
  keywordList.push(document.getElementById(inputField).value);
  localStorage.setItem(localStorageField, JSON.stringify(keywordList) );
  keywordList = JSON.parse(localStorage.getItem(localStorageField));
  document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ");
  return keywordList;
}

function keywordAdder(commitType) {
  switch (commitType) {
    case 1:
      if (document.getElementById("featkwinput").value === "") {
        alert("Field is empty !");
      } else {
        featureKwList = addKeywordLocalStorage('tacticsch-chgmaker-feature-keywords', defaultfeatlist, "featurekwhtml", "featkwinput");
      }   
      break;
    case 2:
      if (document.getElementById("fixkwinput").value === "") {
        alert("Field is empty !")
      } else {
        fixesKwList = addKeywordLocalStorage('tacticsch-chgmaker-fix-keywords', defaultfixlist, "fixkwhtml", "fixkwinput");
      }
      break;
    case 3:
      if (document.getElementById("refkwinput").value === "") {
        alert("Field is empty !")
      } else {
        refactorKwList = addKeywordLocalStorage('tacticsch-chgmaker-ref-keywords', defaultreflist, "refkwhtml", "refkwinput");
      }
      break;
    default:
      console.log("ERROR: Unknown commit type");
      break;
  }
}

function clearKeywordLocalStorage(localStorageField, defaultList, htmlField) {
  localStorage.removeItem(localStorageField);
  keywordList = defaultList;
  localStorage.setItem(localStorageField, JSON.stringify(keywordList) );
  document.getElementById(htmlField).innerHTML = "-- DEFAULT --<br>" + "* " + keywordList.join("<br>* ") + "<br>-------------<br>";
  return keywordList;
}

function keywordClearer(commitType) {
  switch (commitType) {
    case 1:
      featureKwList = clearKeywordLocalStorage('tacticsch-chgmaker-feature-keywords', defaultfeatlist, "featurekwhtml");
      break;
    case 2:
      fixesKwList = clearKeywordLocalStorage('tacticsch-chgmaker-fix-keywords', defaultfixlist, "fixkwhtml");
      break;
    case 3:
      refactorKwList = clearKeywordLocalStorage('tacticsch-chgmaker-ref-keywords', defaultreflist, "refkwhtml");
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

  // Could optimize by converting to JSON after getting all pages //
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
  const urlField = document.getElementById("urlhtml").value.toString();
  const apiField = document.getElementById("apitoken").value.toString();
  const afterField = document.getElementById("afterdate").value.toString();
  const beforeField = document.getElementById("beforedate").value.toString();
  const rawCommits = await getCommits("https://api.github.com/repos/" + urlField + "/commits?per_page=", "100", apiField, beforeField, afterField);
  const commitMessages = rawCommits.map((item) => "[[" + item.sha.substring(0, 8) + "](" + item.html_url + ")] - " + item.commit.message.split("\n")[0] + " | " + item.commit.author.name + " | " + item.commit.author.date);
  const features = [];
  const fixes = [];
  const refs = [];
  const others = [];
  const othersRaw = [];

  if (urlField === "" || apiField === "") {
    alert("Both URL and API token need to be inputted")
  } else {
    document.getElementById("loader").innerHTML = "<center><img src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/source.gif'></img></center>";

    function baliseRemover(commitList, keywordList, finalList) {
      commitList.forEach(function callbackFn(commit) { 
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
  
    baliseRemover(commitMessages, featureKwList, features);
    baliseRemover(commitMessages, fixesKwList, fixes);
    baliseRemover(commitMessages, refactorKwList, refs);
  
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
    })
  
    // DOES NOT WORK - NEED TO REWRITE THIS PIECE OF CODE //
    // othersRaw.forEach(function callbackFn(commit) { 
    //   if (document.getElementsByName('yesNoBalisesOthers')[0].checked) {
    //     othersKwList.forEach(function callbackFn(balise) {
    //       if (document.getElementsByName('yesNoMerges')[0].checked) {
    //         if (commit.match(new RegExp(`(?!\\)\\] - )[[Mm]erge|\[merge\]]`, "g"))) {
    //           others.push(commit.replace(new RegExp(`(?!\\)\\] - ) \\[?${balise}[\\]|:]`, "g"),''));
    //         } 
    //       } else {
    //         others.push(commit.replace(new RegExp(`(?!\\)\\] - ) \\[?${balise}[\\]|:]`, "g"),''));
    //       }
    //     });
    //   } else {
    //     othersKwList.forEach(function callbackFn(balise) {
    //       if (document.getElementsByName('yesNoMerges')[0].checked) {
    //         others.push(commit.replace(new RegExp(`(?!\\)\\] - ) \\[?${balise}[\\]|:]`, "g"),''));
    //       } else {
    //         if (!commit.match(new RegExp(`(?!\\)\\] - )[[Mm]erge|\[merge\]]`, "g"))) {
    //           others.push(commit.replace(new RegExp(`(?!\\)\\] - ) \\[?${balise}[\\]|:]`, "g"),''));
    //         }
    //       }
    //     });
    //   }
    // });
  
    let newBody = '# Changelog - ' + urlField + "\n\n";
    if (beforeField != "" && afterField != "") {
      newBody += `> Commits between ${beforeField} and ${afterField}\n\n`;
    } else if (afterField != "") {
      newBody += `> Commits since ${afterField}\n\n`;
    } else if (beforeField != "") {
      newBody += `> Commits until ${beforeField}\n\n`;
    }
    newBody += `## New features\n\n`;
    newBody += features.join("\n\n");
    newBody += `\n\n## Bug fixes\n\n`;
    newBody += fixes.join("\n\n");
    newBody += `\n\n## Code Refactors\n\n`;
    newBody += refs.join("\n\n");
    newBody += `\n\n## Other types of commits\n\n`;
    newBody += others.join("\n\n");
    document.getElementById("loader").innerHTML = '';
    document.getElementById("bodyhtml").innerHTML = newBody;
    document.getElementById("content_md").innerHTML = marked(newBody);
  }
}

document.addEventListener("DOMContentLoaded", async function(event) {
  const response = await fetch('package.json').then(response => response.json());
  document.getElementById("version").innerHTML = `v${response.version}`
});
