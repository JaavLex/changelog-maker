// default balises to set
let defaultfeatlist = ['[feat]', '[feature]', 'feat:', 'feature:'];
let defaultfixlist = ['[fix]', '[hotfix]', 'fix:', 'hotfix:'];
let defaultreflist = ['[ref]', '[refactor]', 'ref:', 'refactor:'];
let defaultcst1list = [];
let defaultcst2list = [];
// keywords balises list
let featureKwList = [];
let fixesKwList = [];
let refactorKwList = [];
let cst1KwList = [];
let cst2KwList = [];
let othersSelectionList = [];
let currentOutput = "";

// will search previously inputted balises list values in the browser's Local Storage
function loadListLocalStorage(localStorageField, defaultList, htmlField) {
  if (localStorage.getItem(localStorageField) != null) {
    keywordList = JSON.parse(localStorage.getItem(localStorageField));
    keywordList.length > 0 ? document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ") : document.getElementById(htmlField).innerHTML = "-- EMPTY --";
    return keywordList;
  } else {
    let keywordList = [];
    defaultList.length > 0 && (keywordList = keywordList.concat(defaultList));
    keywordList.length > 0 ? document.getElementById(htmlField).innerHTML = "-- DEFAULT --<br>" + "* " + keywordList.join("<br>* ") + "<br>-------------<br>" : document.getElementById(htmlField).innerHTML = "-- EMPTY --";
    localStorage.setItem(localStorageField, JSON.stringify(keywordList));
    return keywordList;
  }
}

// searches for previously selected radio button
function loadRadioLocalStorage(localStorageField, radio) {
  if (localStorage.getItem(localStorageField) != null) {
    localStorage.getItem(localStorageField) == "true" ? radio[0].checked = true : radio[1].checked = true;
  } else {
    radio[1].checked = true;
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
    keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    return keywordList;
  } else {
    let keywordList = [];
    if (JSON.parse(localStorage.getItem(localStorageField)).length > 0) {
      keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    }
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
function clearKeywordLocalStorage(localStorageField, defaultList, htmlField, titleField, titleLocalStorage) {
  localStorage.removeItem(localStorageField);
  if (defaultList.length > 0) {
    localStorage.setItem(localStorageField, JSON.stringify(defaultList));
    document.getElementById(htmlField).innerHTML = "-- DEFAULT --<br>" + "* " + defaultList.join("<br>* ") + "<br>-------------<br>";
  } else {
    localStorage.setItem(localStorageField, JSON.stringify(defaultList));
    document.getElementById(htmlField).innerHTML = "-- DEFAULT --";
  }
  document.getElementById(titleField).value = "";
  localStorage.setItem(titleLocalStorage, document.getElementById(titleField).value);
  let collapsible = document.getElementById("collapsiblecontent");
  collapsible.style.maxHeight = collapsible.scrollHeight + "px";
  return defaultList;
}

// removes a keyword from a list
function removeKeywordLocalStorage(localStorageField, htmlField, inputField, checker) {
  if (!checker.includes(document.getElementById(inputField).value.toLowerCase()) || document.getElementById(inputField).value === "") {
    alert("Wrong value ! Is either empty, or not in the list !");
    keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    return keywordList;
  } else {
    let fieldvalue = document.getElementById(inputField).value.toLowerCase();
    let keywordList = [];
    keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    if (keywordList.indexOf(fieldvalue) !== -1) {
      keywordList.splice(keywordList.indexOf(fieldvalue), 1);
    }
    localStorage.setItem(localStorageField, JSON.stringify(keywordList));
    keywordList.length > 0 ? document.getElementById(htmlField).innerHTML = "* " + keywordList.join("<br>* ") : document.getElementById(htmlField).innerHTML = "";
    document.getElementById(inputField).value = "";
    return keywordList;
  }
}

// Takes user params, check if they are valid, and sets them
function urlGetParams(urlCurrentParams) {
  const urlParams = new URLSearchParams(window.location.search);

  urlCurrentParams.forEach(function callbackFn(item) {
    const field = document.getElementById(item.field);
    const radio = document.getElementsByName(item.field);

    if (urlParams.has(item.param)) {
      item.type === "field" && (field.value = urlParams.get(item.param));
      item.type === "radio" && (urlParams.get(item.param) == "true" ? radio[0].checked = true : radio[1].checked = true);
      if (item.type === "list") {
        item.param = item.default.concat(urlParams.get(item.param).split(','));
        field.innerHTML = "* " + item.param.join("<br>* ")
      }
    }
  });
}

// Takes field values, converts them to URL params and copies them to clipboard
function urlSaveParams(urlCurrentParams) {
  let userSearchParams = "?";
  var dump = document.createElement("textarea");

  urlCurrentParams.forEach((item) => {
    const field = document.getElementById(item.field);
    const radio = document.getElementsByName(item.field);
    let paramsLister = [];
    
    if (item.param !== "apitoken") {
      item.type === "field" && field.value != "" && (userSearchParams += `${item.param}=${field.value}&`);
      item.type === "radio" && (radio[0].checked == true ? userSearchParams += `${item.param}=true&` : userSearchParams += `${item.param}=false&`);
      if (item.type === "list") {
        item.list.forEach((keyword) => !item.default.includes(keyword) && paramsLister.push(keyword));
        paramsLister.length > 0 && (userSearchParams += `${item.param}=${paramsLister.join(',')}&`);
      }
    }
  });

  document.body.appendChild(dump);
  dump.value = location.protocol + '//' + location.host + location.pathname + userSearchParams.slice(0, -1);
  dump.select();
  document.execCommand("copy");
  document.body.removeChild(dump);
  alert("Link has been copied to your clipboard");
}

function urlParamsActions(save) {
  // Search params
  const urlExistingParams = [{
      "param": "url",
      "field": "urlhtml",
      "type": "field"
    },
    {
      "param": "apitoken",
      "field": "apitoken",
      "type": "field"
    },
    {
      "param": "before",
      "field": "beforedate",
      "type": "field"
    },
    {
      "param": "after",
      "field": "afterdate",
      "type": "field"
    },
    {
      "param": "balises",
      "field": "yesnobalises",
      "type": "radio"
    },
    {
      "param": "balisesother",
      "field": "yesnobalisesothers",
      "type": "radio"
    },
    {
      "param": "merges",
      "field": "yesnomerges",
      "type": "radio"
    },
    {
      "param": "markdown",
      "field": "mdorhtml",
      "type": "radio"
    },
    {
      "param": "feat",
      "field": "featurekwhtml",
      "list": featureKwList,
      "default": defaultfeatlist,
      "type": "list"
    },
    {
      "param": "fix",
      "field": "fixkwhtml",
      "list": fixesKwList,
      "default": defaultfixlist,
      "type": "list"
    },
    {
      "param": "ref",
      "field": "refkwhtml",
      "list": refactorKwList,
      "default": defaultreflist,
      "type": "list"
    },
    {
      "param": "cst1",
      "field": "cst1kwhtml",
      "list": cst1KwList,
      "default": defaultcst1list,
      "type": "list"
    },
    {
      "param": "cst2",
      "field": "cst2kwhtml",
      "list": cst2KwList,
      "default": defaultcst2list,
      "type": "list"
    }
  ]
  save ? urlSaveParams(urlExistingParams) : urlGetParams(urlExistingParams);
}

// either loads all previously inputted values, or saves them depending wether pageload == true or pageload == false
function localStorageManager(pageload) {
  if (pageload) {
    // date and text fields local storage value loading
    document.getElementById("urlhtml").value = localStorage.getItem('tacticsch-chgmaker-url-storage');
    document.getElementById("apitoken").value = localStorage.getItem('tacticsch-chgmaker-token-storage');
    document.getElementById("beforedate").value = localStorage.getItem('tacticsch-chgmaker-before-storage');
    document.getElementById("afterdate").value = localStorage.getItem('tacticsch-chgmaker-after-storage');
    document.getElementById("feattitle").value = localStorage.getItem('tacticsch-chgmaker-feat-title-storage');
    document.getElementById("fixtitle").value = localStorage.getItem('tacticsch-chgmaker-fix-title-storage');
    document.getElementById("reftitle").value = localStorage.getItem('tacticsch-chgmaker-ref-title-storage');
    document.getElementById("cst1title").value = localStorage.getItem('tacticsch-chgmaker-cst1-title-storage');
    document.getElementById("cst2title").value = localStorage.getItem('tacticsch-chgmaker-cst2-title-storage');
    // balises list local storage value loading
    featureKwList = loadListLocalStorage('tacticsch-chgmaker-feature-keywords', defaultfeatlist, "featurekwhtml");
    fixesKwList = loadListLocalStorage('tacticsch-chgmaker-fix-keywords', defaultfixlist, "fixkwhtml");
    refactorKwList = loadListLocalStorage('tacticsch-chgmaker-ref-keywords', defaultreflist, "refkwhtml");
    cst1KwList = loadListLocalStorage('tacticsch-chgmaker-cst1-keywords', defaultcst1list, "cst1kwhtml");
    cst2KwList = loadListLocalStorage('tacticsch-chgmaker-cst2-keywords', defaultcst2list, "cst2kwhtml");
    // radio button options local storage value loading
    loadRadioLocalStorage('tacticsch-chgmaker-balises-option', document.getElementsByName("yesnobalises"));
    loadRadioLocalStorage('tacticsch-chgmaker-balises-other-option', document.getElementsByName("yesnobalisesothers"));
    loadRadioLocalStorage('tacticsch-chgmaker-merges-option', document.getElementsByName("yesnomerges"));
    loadRadioLocalStorage('tacticsch-chgmaker-mdhtml-option', document.getElementsByName("mdorhtml"));
    // If user sets parameters in URL, set them.
    urlParamsActions(false);
  } else {
    // date and text fields local storage value saving
    localStorage.setItem('tacticsch-chgmaker-url-storage', document.getElementById("urlhtml").value);
    localStorage.setItem('tacticsch-chgmaker-token-storage', document.getElementById("apitoken").value);
    localStorage.setItem('tacticsch-chgmaker-before-storage', document.getElementById("beforedate").value);
    localStorage.setItem('tacticsch-chgmaker-after-storage', document.getElementById("afterdate").value);
    localStorage.setItem('tacticsch-chgmaker-feat-title-storage', document.getElementById("feattitle").value);
    localStorage.setItem('tacticsch-chgmaker-fix-title-storage', document.getElementById("fixtitle").value);
    localStorage.setItem('tacticsch-chgmaker-ref-title-storage', document.getElementById("reftitle").value);
    localStorage.setItem('tacticsch-chgmaker-cst1-title-storage', document.getElementById("cst1title").value);
    localStorage.setItem('tacticsch-chgmaker-cst2-title-storage', document.getElementById("cst2title").value);
    // radio button options local storage value saving
    saveRadioLocalStorage('tacticsch-chgmaker-balises-option', document.getElementsByName("yesnobalises"));
    saveRadioLocalStorage('tacticsch-chgmaker-balises-other-option', document.getElementsByName("yesnobalisesothers"));
    saveRadioLocalStorage('tacticsch-chgmaker-merges-option', document.getElementsByName("yesnomerges"));
    saveRadioLocalStorage('tacticsch-chgmaker-mdhtml-option', document.getElementsByName("mdorhtml"));
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
    case 4:
      cst1KwList = addKeywordLocalStorage('tacticsch-chgmaker-cst1-keywords', "cst1kwhtml", "cst1kwinput", cst1KwList);
      break;
    case 5:
      cst2KwList = addKeywordLocalStorage('tacticsch-chgmaker-cst2-keywords', "cst2kwhtml", "cst2kwinput", cst2KwList);
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
      featureKwList = clearKeywordLocalStorage('tacticsch-chgmaker-feature-keywords', defaultfeatlist, "featurekwhtml", "feattitle", 'tacticsch-chgmaker-feat-title-storage');
      break;
    case 2:
      fixesKwList = clearKeywordLocalStorage('tacticsch-chgmaker-fix-keywords', defaultfixlist, "fixkwhtml", "fixtitle", 'tacticsch-chgmaker-fix-title-storage');
      break;
    case 3:
      refactorKwList = clearKeywordLocalStorage('tacticsch-chgmaker-ref-keywords', defaultreflist, "refkwhtml", "reftitle", 'tacticsch-chgmaker-ref-title-storage');
      break;
    case 4:
      cst1KwList = clearKeywordLocalStorage('tacticsch-chgmaker-cst1-keywords', defaultcst1list, "cst1kwhtml", "cst1title", 'tacticsch-chgmaker-cst1-title-storage');
      break;
    case 5:
      cst2KwList = clearKeywordLocalStorage('tacticsch-chgmaker-cst2-keywords', defaultcst2list, "cst2kwhtml", "cst2title", 'tacticsch-chgmaker-cst2-title-storage');
      break;
    case 6:
      document.getElementById("othertitle").value = "";
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
    case 4:
      cst1KwList = removeKeywordLocalStorage('tacticsch-chgmaker-cst1-keywords', "cst1kwhtml", "cst1kwremove", cst1KwList);
      break;
    case 5:
      cst2KwList = removeKeywordLocalStorage('tacticsch-chgmaker-cst2-keywords', "cst2kwhtml", "cst2kwremove", cst2KwList);
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
    method: "GET"
  })

  // if url returns 404, alerts user
  if (headersRequest.status == 404) {
    document.getElementById("loader").innerHTML = "";
    alert("URL/Location is not valid.");
    throw new Error("URL/Location is not valid.");
  }

  // if url returns 404, alerts user
  if (headersRequest.status == 403) {
    document.getElementById("loader").innerHTML = "";
    alert("You've reached the API's limit rate. Please input a token to generate further changelogs.");
    throw new Error("API's limit rate has been reached.");
  }

  // trims the links given by the request in order to only get the number of pages
  let headerLink = headersRequest.headers.get("link");
  if (headerLink) {
    rgxmatch = headerLink.match(/&page=(\d*)>; rel="last"/);
    totalPage = Math.ceil(rgxmatch[1] / nbCommits);
  }

  if (totalPage > 5 && document.getElementById("apitoken").value == "") {
    alert(`ALERT: This request has ${totalPage} pages of commits. All requests of more than 5 pages require a token !`);
    return false;
  } else {
    // gets all commits from a repository. sets date parameters, take an API token, and pushes commits to a variable.
    for (let i = 1; i <= totalPage; i++) {
      const tokenrep = document.getElementById("apitoken").value == "" ?  null : `token ${apiKey}`;
      const repoContent = await fetch(repoUrl + nbCommits + "&page=" + i + dateParameters, {
        method: "GET",
        headers: {
          Authorization: `${tokenrep}`
        },
      });
      console.log(totalPage)
      const jsonCommits = await repoContent.json();
      repoCommits.push(...jsonCommits);
    };

    return repoCommits;
  }
}

function dateFormatting(date) {
  return new Date(date).toLocaleString('default', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
}

// \s all special characters in a string in order to input that into a regex
function quotemeta(str) {
  return (str + '').replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
}

// removes commit balises based on user's list of keywords, and at the same time sorts them into the right category
function baliseRemover(commitList, keywordList, finalList) {
  commitList.forEach(function callbackFn(commit) {
    keywordList.forEach(function callbackFn(balise) {
      if (commit.match(new RegExp(`(?<=\\)\\] - )${quotemeta(balise)} `, 'i'))) {
        if (document.getElementsByName('yesnobalises')[1].checked) {
          finalList.push(commit.replace(new RegExp(`(?<=\\)\\] - )${quotemeta(balise)} `, 'i'), ''));
        } else {
          finalList.push(commit);
        }
      }
    });
  });
}

// main app function. sorts all commits received by getCommits() function based on user's options.
async function sortCommits() {
  // Sets loader
  document.getElementById("loader").innerHTML = "<center><img src='./loading.svg'></img></center>";

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
  const commitMessages = rawCommits != false && rawCommits.map((item) => "[[" + item.sha.substring(0, 8) + "](" + item.html_url + ")] - " + item.commit.message.split("\n")[0] + " ● 👤 ⇒ [" + item.commit.author.name + "](" + (item.author && item.author.html_url) + ")" + " ― 📅 ⇒ " + dateFormatting(item.commit.author.date));
  const features = [];
  const fixes = [];
  const refs = [];
  const cst1 = [];
  const cst2 = [];
  const others = [];
  const othersRaw = [];

  if (urlField === "") {
    document.getElementById("loader").innerHTML = "";
    alert("URL needs to be inputted");
  } else if (rawCommits == false) {
    document.getElementById("loader").innerHTML = "";
  } else {
    baliseRemover(commitMessages, featureKwList, features);
    baliseRemover(commitMessages, fixesKwList, fixes);
    baliseRemover(commitMessages, refactorKwList, refs);
    if (cst1KwList.length > 0) {
      baliseRemover(commitMessages, cst1KwList, cst1);
    }
    if (cst2KwList.length > 0) {
      baliseRemover(commitMessages, cst2KwList, cst2);
    }

    // eliminated keywords, MUSN'T have one of these in order to get sorted into others
    othersSelectionList = othersSelectionList.concat(featureKwList);
    othersSelectionList = othersSelectionList.concat(fixesKwList);
    othersSelectionList = othersSelectionList.concat(refactorKwList);
    if (cst1KwList.length > 0) {
      othersSelectionList = othersSelectionList.concat(cst1KwList);
    }
    if (cst2KwList.length > 0) {
      othersSelectionList = othersSelectionList.concat(cst2KwList);
    }

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
      if (document.getElementsByName('yesnobalisesothers')[0].checked) {
        if (document.getElementsByName('yesnomerges')[1].checked) {
          !commit.match(new RegExp(`(?<=\\)\\] - )[[Mm]erge|\\[merge\\]] `, 'g')) && others.push(commit);
        } else {
          others.push(commit);
        }
      } else {
        if (document.getElementsByName('yesnomerges')[1].checked) {
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
      if (document.getElementById("feattitle").value != "") {
        newBody += `## ${document.getElementById("feattitle").value}\n\n`;
      } else {
        newBody += `## ✨ New features\n\n`;
      }
      newBody += features.join("\n\n");
    };
    if (fixes.length > 0) {
      if (document.getElementById("fixtitle").value != "") {
        newBody += `\n\n## ${document.getElementById("fixtitle").value}\n\n`;
      } else {
        newBody += `\n\n## 🐛 Bug fixes\n\n`;
      }
      newBody += fixes.join("\n\n");
    };
    if (refs.length > 0) {
      if (document.getElementById("reftitle").value != "") {
        newBody += `\n\n## ${document.getElementById("reftitle").value}\n\n`;
      } else {
        newBody += `\n\n## ♻️ Code Refactors\n\n`;
      }
      newBody += refs.join("\n\n");
    };
    if (cst1.length > 0) {
      if (document.getElementById("cst1title").value != "") {
        newBody += `\n\n## ${document.getElementById("cst1title").value}\n\n`;
      } else {
        newBody += `\n\n## 📘 Custom category 1\n\n`;
      }
      newBody += cst1.join("\n\n");
    };
    if (cst2.length > 0) {
      if (document.getElementById("cst2title").value != "") {
        newBody += `\n\n## ${document.getElementById("cst2title").value}\n\n`;
      } else {
        newBody += `\n\n## 📙 Custom category 2\n\n`;
      }
      newBody += cst2.join("\n\n");
    };
    if (others.length > 0) {
      if (document.getElementById("othertitle").value != "") {
        newBody += `\n\n## ${document.getElementById("othertitle").value}\n\n`;
      } else {
        newBody += `\n\n## 📚 Other commits\n\n`;
      }
      newBody += others.join("\n\n");
    };
    document.getElementById("loader").innerHTML = '';
    // either shows the commit in raw markdown, or convert it into HTML
    if (document.getElementsByName('mdorhtml')[0].checked) {
      document.getElementById("bodyhtml").innerHTML = `<pre id="md-body">${newBody}</pre>`;
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