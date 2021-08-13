// default balises to set
let defaultfeatlist = ['[feat]', '[feature]', 'feat:', 'feature:'];
let defaultfixlist = ['[fix]', '[hotfix]', 'fix:', 'hotfix:'];
let defaultreflist = ['[ref]', '[refactor]', 'ref:', 'refactor:'];
// keywords balises list
let featureKwList = [];
let fixesKwList = [];
let refactorKwList = [];
let othersSelectionList = [];
let currentOutput = "";

// will search previously inputted balises list values in the browser's Local Storage
function loadListLocalStorage(localStorageField, defaultList, htmlField) {
  if (localStorage.getItem(localStorageField) != null) {
    keywordList = JSON.parse(localStorage.getItem(localStorageField));
    document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ");
    return keywordList;
  } else {
    let keywordList = [];
    keywordList = keywordList.concat(defaultList);
    document.getElementById(htmlField).innerHTML = "-- DEFAULT --<br>" + "* " + keywordList.join("<br>* ") + "<br>-------------<br>";
    localStorage.setItem(localStorageField, JSON.stringify(keywordList));
    return keywordList;
  }
}

// searches for previously selected radio button
function loadRadioLocalStorage(localStorageField, radio) {
  if (localStorage.getItem(localStorageField) != null) {
    localStorage.getItem(localStorageField) == "true" ? radio[0].checked = true : radio[1].checked = true;
  }
}

// saves value of checked radio button
function saveRadioLocalStorage(localStorageField, radio) {
  for (let i = 0; i < radio.length; i++) {
    radio[i].checked && localStorage.setItem(localStorageField, radio[i].value);
  }
}

// saves balises keyword lists
function addKeywordLocalStorage(localStorageField, htmlField, inputField, checker) {
  if (checker.includes(document.getElementById(inputField).value.toLowerCase()) || document.getElementById(inputField).value === "") {
    alert("Wrong value ! Is either empty, or already in the list !");
  } else {
    let keywordList = [];
    keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    keywordList.push(document.getElementById(inputField).value.toLowerCase());
    localStorage.setItem(localStorageField, JSON.stringify(keywordList));
    document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ");
    document.getElementById(inputField).value = "";
    let collapsible = document.getElementById("collapsiblecontent"); 
    collapsible.style.maxHeight = collapsible.scrollHeight + "px";
    return keywordList;
  }
}

// clears balises keyword lists
function clearKeywordLocalStorage(localStorageField, defaultList, htmlField) {
  localStorage.removeItem(localStorageField);
  localStorage.setItem(localStorageField, JSON.stringify(defaultList));
  document.getElementById(htmlField).innerHTML = "-- DEFAULT --<br>" + "* " + defaultList.join("<br>* ") + "<br>-------------<br>";
  let collapsible = document.getElementById("collapsiblecontent"); 
  collapsible.style.maxHeight = collapsible.scrollHeight + "px";
  return defaultList;
}

// removes a keyword from a list
function removeKeywordLocalStorage(localStorageField, htmlField, inputField, checker) {
  if (!checker.includes(document.getElementById(inputField).value.toLowerCase()) || document.getElementById(inputField).value === "") {
    alert("Wrong value ! Is either empty, or not in the list !");
  } else {
    let fieldvalue = document.getElementById(inputField).value.toLowerCase();
    let keywordList = [];
    keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    if (keywordList.indexOf(fieldvalue) !== -1) {
      keywordList.splice(keywordList.indexOf(fieldvalue), 1);
    }
    localStorage.setItem(localStorageField, JSON.stringify(keywordList));
    document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ");
    document.getElementById(inputField).value = "";
    return keywordList;
  }
}

// either loads all previously inputted values, or saves them depending wether pageload == true or pageload == false
function localStorageManager(pageload) {
  if (pageload) {
    // date and text fields local storage value loading
    document.getElementById("urlhtml").value = localStorage.getItem('tacticsch-chgmaker-url-storage');
    document.getElementById("apitoken").value = localStorage.getItem('tacticsch-chgmaker-token-storage');
    document.getElementById("beforedate").value = localStorage.getItem('tacticsch-chgmaker-before-storage');
    document.getElementById("afterdate").value = localStorage.getItem('tacticsch-chgmaker-after-storage');
    // balises list local storage value loading
    featureKwList = loadListLocalStorage('tacticsch-chgmaker-feature-keywords', defaultfeatlist, "featurekwhtml");
    fixesKwList = loadListLocalStorage('tacticsch-chgmaker-fix-keywords', defaultfixlist, "fixkwhtml");
    refactorKwList = loadListLocalStorage('tacticsch-chgmaker-ref-keywords', defaultreflist, "refkwhtml");
    // radio button options local storage value loading
    loadRadioLocalStorage('tacticsch-chgmaker-balises-option', document.getElementsByName("yesNoBalises"));
    loadRadioLocalStorage('tacticsch-chgmaker-balises-other-option', document.getElementsByName("yesNoBalisesOthers"));
    loadRadioLocalStorage('tacticsch-chgmaker-merges-option', document.getElementsByName("yesNoMerges"));
    loadRadioLocalStorage('tacticsch-chgmaker-mdhtml-option', document.getElementsByName("MdOrHtml"));
  } else {
    // date and text fields local storage value saving
    localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value);
    localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value);
    localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value);
    localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value);
    // radio button options local storage value saving
    saveRadioLocalStorage('tacticsch-chgmaker-balises-option', document.getElementsByName("yesNoBalises"));
    saveRadioLocalStorage('tacticsch-chgmaker-balises-other-option', document.getElementsByName("yesNoBalisesOthers"));
    saveRadioLocalStorage('tacticsch-chgmaker-merges-option', document.getElementsByName("yesNoMerges"));
    saveRadioLocalStorage('tacticsch-chgmaker-mdhtml-option', document.getElementsByName("MdOrHtml"));
  }
}

// balises keyword adding function
function keywordAdder(commitType) {
  switch (commitType) {
    case 1:
      featureKwList = addKeywordLocalStorage('tacticsch-chgmaker-feature-keywords', "featurekwhtml", "featkwinput", featureKwList);
      break;
    case 2:
      fixesKwList = addKeywordLocalStorage('tacticsch-chgmaker-fix-keywords', "fixkwhtml", "fixkwinput", fixesKwList);
      break;
    case 3:
      refactorKwList = addKeywordLocalStorage('tacticsch-chgmaker-ref-keywords', "refkwhtml", "refkwinput", refactorKwList);
      break;
    default:
      console.log("ERROR: Unknown commit type");
      break;
  }
}

// balises keyword clearing function
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

// balises keyword removing function
function keywordRemover(commitType) {
  switch (commitType) {
    case 1:
      featureKwList = removeKeywordLocalStorage('tacticsch-chgmaker-feature-keywords', "featurekwhtml", "featkwremove", featureKwList);
      break;
    case 2:
      fixesKwList = removeKeywordLocalStorage('tacticsch-chgmaker-fix-keywords', "fixkwhtml", "fixkwremove", fixesKwList);
      break;
    case 3:
      refactorKwList = removeKeywordLocalStorage('tacticsch-chgmaker-ref-keywords', "refkwhtml", "refkwremove", refactorKwList);
      break;
    default:
      console.log("ERROR: Unknown commit type");
      break;
  }
}

// clears the html form
function clearFields() {
  document.getElementById("urlhtml").value = "";
  document.getElementById("apitoken").value = "";
  document.getElementById("beforedate").value = "";
  document.getElementById("afterdate").value = "";
  // Sets the new empty values in the Local Storage
  localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value);
  localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value);
  localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value);
  localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value);
}

function openCloseCollapsible() {
  let collapsible = document.getElementById("collapsiblecontent"); 
  if (collapsible.style.maxHeight) {
    collapsible.style.maxHeight = null;
    document.getElementById("collarrow").innerHTML = "⇐";
  } else {
    collapsible.style.maxHeight = collapsible.scrollHeight + "px";
    document.getElementById("collarrow").innerHTML = "⇓";
  }
}

function copyToClipboard() {
  if (currentOutput != "") {
    var dump = document.createElement("textarea");
    document.body.appendChild(dump);
    dump.value = currentOutput;
    dump.select();
    document.execCommand("copy");
    document.body.removeChild(dump);
    alert("Mardkown has been copied to your clipboard");
  }
}

function clearDateField(beforeOrAfter) {
  switch (beforeOrAfter) {
    case 1:
        document.getElementById("beforedate").value = "";
      break;
    case 2:
        document.getElementById("afterdate").value = "";
      break;
    default:
      console.log("ERROR: Unknown date type");
      break;
  }
}

// API searching and returning for a repository's commit
async function getCommits(repoUrl, nbCommits, apiKey, beforeDate, afterDate) {
  const repoCommits = [];
  let dateParameters = "";
  let totalPage = 0;

  // sets the string necessary to set datefield parameters in the request
  if (beforeDate != "" && afterDate != "") {
    dateParameters = `&since=${afterDate}Z&until=${beforeDate}Z`;
  } else if (afterDate != "") {
    dateParameters = `&since=${afterDate}Z`;
  } else if (beforeDate != "") {
    dateParameters = `&until=${beforeDate}Z`;
  }

  // searches for the numbers of pages in the repository's API page. needs an API token key (taken from the form).
  const headersRequest = await fetch(repoUrl + "1" + dateParameters, {
    method: "GET",
    headers: {
      Authorization: `token ${apiKey}`
    },
  })
  
  // if url returns 404, alerts user
  if (headersRequest.status != 200) {
    alert("URL/Location is not valid.");
    throw new Error("URL/Location is not valid.");
  }

  // trims the links given by the request in order to only get the number of pages
  let headerLink = headersRequest.headers.get("link");
  if (headerLink) {
    rgxmatch = headerLink.match(/&page=(\d*)>; rel="last"/);
    totalPage = Math.ceil(rgxmatch[1] / nbCommits);
  }

  // gets all commits from a repository. sets date parameters, take an API token, and pushes commits to a variable.
  for (let i = 1; i <= totalPage; i++) {
    const repoContent = await fetch(repoUrl + nbCommits + "&page=" + i + dateParameters, {
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

function dateFormatting(date) {
  return new Date(date).toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'});
}

// main app function. sorts all commits received by getCommits() function based on user's options.
async function sortCommits() {
  let urlField = document.getElementById("urlhtml").value.toString();
  // if is a url converts it to something usable
  if (urlField.match(new RegExp(`(\\.com\\/)(.*)`, 'i'))) {
    urlField = urlField.match(new RegExp(`(\\.com\\/)(.*)`, 'i'))[2];
  }
  const apiField = document.getElementById("apitoken").value.toString();
   const afterField = document.getElementById("afterdate").value.toString();
  const beforeField = document.getElementById("beforedate").value.toString();
  const rawCommits = await getCommits("https://api.github.com/repos/" + urlField + "/commits?per_page=", "100", apiField, beforeField, afterField);
  // Already sets a formatted commit message
  const commitMessages = rawCommits.map((item) => "[[" + item.sha.substring(0, 8) + "](" + item.html_url + ")] - " + item.commit.message.split("\n")[0] + " ● 👤 ⇒ [" + item.commit.author.name + "](" + (item.author && item.author.html_url) + ")" + " ― 📅 ⇒ " + dateFormatting(item.commit.author.date));
  const features = [];
  const fixes = [];
  const refs = [];
  const others = [];
  const othersRaw = [];

  if (urlField === "" || apiField === "") {
    alert("Both URL and API token need to be inputted")
  } else {
    document.getElementById("loader").innerHTML = "<center><img src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/source.gif'></img></center>";

    // \s all special characters in a string in order to input that into a regex
    function quotemeta(str) {
      return (str + '').replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
    }

    // removes commit balises based on user's list of keywords, and at the same time sorts them into the right category
    function baliseRemover(commitList, keywordList, finalList) {
      commitList.forEach(function callbackFn(commit) {
        keywordList.forEach(function callbackFn(balise) {

          if (commit.match(new RegExp(`(?<=\\)\\] - )${quotemeta(balise)} `, 'i'))) {
            if (document.getElementsByName('yesNoBalises')[1].checked) {
              finalList.push(commit.replace(new RegExp(`(?<=\\)\\] - )${quotemeta(balise)} `, 'i'), ''));
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

    // eliminated keywords, MUSN'T have one of these in order to get sorted into others
    othersSelectionList = othersSelectionList.concat(featureKwList);
    othersSelectionList = othersSelectionList.concat(fixesKwList);
    othersSelectionList = othersSelectionList.concat(refactorKwList);

    // checks if doesn't matches previous balises and pushes them into a variable
    commitMessages.forEach(function callbackFn(commit) {
      let noMatch = 0;
      for (let i = 0; i < othersSelectionList.length; i++) {
        if (!commit.match(new RegExp(`(?<=\\)\\] - )${quotemeta(othersSelectionList[i])} `, 'i'))) {
          noMatch++;
        }
      }
      if (noMatch === othersSelectionList.length) {
        othersRaw.push(commit);
      }
    })

    // Reset list
    othersSelectionList = [];

    // pushes commits into others, gives the option to ommit merges or to remove the first word of the commit (in most case, the balise)
    othersRaw.forEach(function callbackFn(commit) {
      if (document.getElementsByName('yesNoBalisesOthers')[0].checked) {
        if (document.getElementsByName('yesNoMerges')[1].checked) {
          !commit.match(new RegExp(`(?<=\\)\\] - )[[Mm]erge|\\[merge\\]] `, 'g')) && others.push(commit);
        } else {
          others.push(commit);
        }
      } else {
        if (document.getElementsByName('yesNoMerges')[1].checked) {
          !commit.match(new RegExp(`(?<=\\)\\] - )[[Mm]erge|\\[merge\\]] `, "g")) && others.push(commit.replace(new RegExp(`(?<=\\)\\] - )\\[?\\w+[:|\\]]? `, 'i'), ''));
        } else {
          others.push(commit.replace(new RegExp(`(?<=\\)\\] - )\\[?\\w+[:|\\]]? `, 'i'), ''));
        }
      }
    });

    // formats all the commits into a changelog (in markdown)
    let newBody = '# 📑 Changelog - ' + urlField + "\n\n";
    if (beforeField != "" && afterField != "") {
      newBody += `> 🕐 Commits between ${dateFormatting(beforeField)} and ${dateFormatting(afterField)}\n\n`;
    } else if (afterField != "") {
      newBody += `> 🕐 Commits since ${dateFormatting(afterField)}\n\n`;
    } else if (beforeField != "") {
      newBody += `> 🕐 Commits until ${dateFormatting(beforeField)}\n\n`;
    }
    // checks if found these types of commits and adds them to the changelog afterwards
    if (features.length > 0) {
      newBody += `## ✨ New features\n\n`;
      newBody += features.join("\n\n");
    };
    if (fixes.length > 0) {
      newBody += `\n\n## 🐛 Bug fixes\n\n`;
      newBody += fixes.join("\n\n");
    };
    if (refs.length > 0) {
      newBody += `\n\n## ♻ Code Refactors\n\n`;
      newBody += refs.join("\n\n");
    };
    if (others.length > 0) {
      newBody += `\n\n## 📚 Other types of commits\n\n`;
      newBody += others.join("\n\n");
    };
    document.getElementById("loader").innerHTML = '';
    // either shows the commit in raw markdown, or convert it into HTML
    if (document.getElementsByName('MdOrHtml')[0].checked) {
      document.getElementById("bodyhtml").innerHTML = `<pre>${newBody}</pre>`;
    } else {
      document.getElementById("bodyhtml").innerHTML = marked(newBody);
    }
    currentOutput = newBody;
  }
}

// shows current app version on website
document.addEventListener("DOMContentLoaded", async function (event) {
  const response = await fetch('package.json').then(response => response.json());
  document.getElementById("version").innerHTML = `v${response.version}`
});