// default balises to set
const defaultfeatlist = ['[feat]', '[feature]', 'feat:', 'feature:'];
const defaultfixlist = ['[fix]', '[hotfix]', 'fix:', 'hotfix:'];
const defaultreflist = ['[ref]', '[refactor]', 'ref:', 'refactor:'];
const defaultcst1list = [];
const defaultcst2list = [];
// keywords balises list
let featureKwList = [];
let fixesKwList = [];
let refactorKwList = [];
let cst1KwList = [];
let cst2KwList = [];
let othersSelectionList = [];
let currentChangelogOutput = "";

// Changes display of a list based on his mode
function listDisplay(htmlField, keywordList, mode) {
  const listJoining = "* " + keywordList.join("<br>* ");
  switch (mode) {
    case 0:
      document.getElementById(htmlField).innerHTML = listJoining;
      break;
    case 1:
      document.getElementById(htmlField).innerHTML = `-- DEFAULT --<br>${listJoining}<br>-------------<br>`;
      break;
    default:
      document.getElementById(htmlField).innerHTML = `-- DEFAULT --`;
      break;
  }
}

// will search previously inputted balises list values in the browser's Local Storage
function loadListLocalStorage(localStorageField, defaultList, htmlField) {
  if (localStorage.getItem(localStorageField) != null) {
    keywordList = JSON.parse(localStorage.getItem(localStorageField));
    keywordList.length > 0 ? listDisplay(htmlField, keywordList, 0) : listDisplay(htmlField, keywordList);
    return keywordList;
  } else {
    let keywordList = [];
    defaultList.length > 0 && (keywordList = keywordList.concat(defaultList));
    keywordList.length > 0 ? listDisplay(htmlField, keywordList, 1) : listDisplay(htmlField, keywordList);
    localStorage.setItem(localStorageField, JSON.stringify(keywordList));
    return keywordList;
  }
}

// searches for previously selected radio button
function loadRadioLocalStorage(localStorageField, radio) {
  localStorage.getItem(localStorageField) != null ? (localStorage.getItem(localStorageField) == "true" ? radio[0].checked = true : radio[1].checked = true) : radio[1].checked = true;
}

// saves value of checked radio button
function saveRadioLocalStorage(localStorageField, radio) {
  radio.forEach((item) => item.checked && localStorage.setItem(localStorageField, item.value))
}

// Augments the size of the collapsible when a modification is made
function resizeCollapsible() {
  document.getElementById("collapsiblecontent").style.maxHeight = document.getElementById("collapsiblecontent").scrollHeight + "px";
}

// Changes list and displays it afterwards
function setList(localStorageField, htmlField, keywordList, mode) {
  localStorage.setItem(localStorageField, JSON.stringify(keywordList));
  listDisplay(htmlField, keywordList, mode);
}

// saves balises keyword lists
function addKeywordLocalStorage(localStorageField, htmlField, inputField, checker) {
  if (checker.includes(document.getElementById(inputField).value.toLowerCase()) || document.getElementById(inputField).value === "") {
    alert("Wrong value ! Is either empty, or already in the list !");
    keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    return keywordList;
  } else {
    let keywordList = [];
    JSON.parse(localStorage.getItem(localStorageField)).length > 0 && (keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField))));
    keywordList.push(document.getElementById(inputField).value.toLowerCase());
    setList(localStorageField, htmlField, keywordList, 0);
    document.getElementById(inputField).value = "";
    resizeCollapsible();
    return keywordList;
  }
}

// clears balises keyword lists
function clearKeywordLocalStorage(localStorageField, defaultList, htmlField, titleField, titleLocalStorage) {
  localStorage.removeItem(localStorageField);
  defaultList.length > 0 ? setList(localStorageField, htmlField, defaultList, 1) : setList(localStorageField, htmlField, defaultList);
  document.getElementById(titleField).value = "";
  localStorage.setItem(titleLocalStorage, document.getElementById(titleField).value);
  resizeCollapsible();
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
    keywordList = keywordList.concat(JSON.parse(localStorage.getItem(localStorageField)));
    keywordList.indexOf(fieldvalue) !== -1 && keywordList.splice(keywordList.indexOf(fieldvalue), 1);
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
        field.innerHTML = "* " + item.param.join("<br>* ");
      }
    }
  });
}

// Copies data to clipboard
function copyToClipboard(mode, input) {
  if (mode ? currentChangelogOutput != "" : input != "") {
    var dump = document.createElement("textarea");
    document.body.appendChild(dump);
    dump.value = mode ? currentChangelogOutput : input;
    dump.select();
    document.execCommand("copy");
    document.body.removeChild(dump);
    alert("Mardkown has been copied to your clipboard");
  }
}

// Takes field values, converts them to URL params and copies them to clipboard
function urlSaveParams(urlCurrentParams) {
  let userSearchParams = "?";
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
  copyToClipboard(false, location.protocol + '//' + location.host + location.pathname + userSearchParams.slice(0, -1))
}

function urlParamsActions(save) {
  // Search params
  const urlExistingParams = [
    {"param": "url", "field": "urlhtml", "type": "field"},
    {"param": "apitoken", "field": "apitoken", "type": "field"},
    {"param": "before", "field": "beforedate", "type": "field"},
    {"param": "after", "field": "afterdate", "type": "field"},
    {"param": "balises", "field": "yesnobalises", "type": "radio"},
    {"param": "balisesother", "field": "yesnobalisesothers", "type": "radio"},
    {"param": "merges", "field": "yesnomerges", "type": "radio"},
    {"param": "markdown", "field": "mdorhtml", "type": "radio"},
    {"param": "feat", "field": "featurekwhtml", "list": featureKwList, "default": defaultfeatlist, "type": "list"},
    {"param": "fix", "field": "fixkwhtml", "list": fixesKwList, "default": defaultfixlist, "type": "list"},
    {"param": "ref", "field": "refkwhtml", "list": refactorKwList, "default": defaultreflist, "type": "list"},
    {"param": "cst1","field": "cst1kwhtml","list": cst1KwList,"default": defaultcst1list,"type": "list"},
    {"param": "cst2", "field": "cst2kwhtml", "list": cst2KwList, "default": defaultcst2list, "type": "list"}
  ]
  save ? urlSaveParams(urlExistingParams) : urlGetParams(urlExistingParams);
}

// Reassigns keyword list value
function setKwList(list, value) {
  switch (list) {
    case 1:
      featureKwList = value;
      break;
    case 2:
      fixesKwList = value;
      break;
    case 3:
      refactorKwList = value;
      break;
    case 4:
      cst1KwList = value;
      break;
    case 5:
      cst2KwList = value;
      break;
  }
}

// Gets data from local storage
function getLocalStorage(type, htmlfield, localstorage, defaultlist, list) {
  switch (type) {
    case "field":
      document.getElementById(htmlfield).value = localStorage.getItem(localstorage);
      break;
    case "list":
      setKwList(list, loadListLocalStorage(localstorage, defaultlist, htmlfield));
      break;
    case "radio":
      loadRadioLocalStorage(localstorage, document.getElementsByName(htmlfield));
      break;
  }
}

// Sets values in local storage
function setLocalStorage(type, htmlfield, localstorage) {
  type == "field" ? localStorage.setItem(localstorage, document.getElementById(htmlfield).value) : saveRadioLocalStorage(localstorage, document.getElementsByName(htmlfield));
}

// either loads all previously inputted values, or saves them depending wether pageload == true or pageload == false
function localStorageManager(pageload) {
  const fieldsStorage = [
    {"type": "field","htmlfield": "urlhtml", "localstorage": "tacticsch-chgmaker-url-storage"},
    {"type": "field","htmlfield": "apitoken", "localstorage": "tacticsch-chgmaker-token-storage"},
    {"type": "field","htmlfield": "beforedate", "localstorage": "tacticsch-chgmaker-before-storage"},
    {"type": "field","htmlfield": "afterdate", "localstorage": "tacticsch-chgmaker-after-storage"},
    {"type": "field","htmlfield": "feattitle", "localstorage": "tacticsch-chgmaker-feat-title-storage"},
    {"type": "field","htmlfield": "fixtitle", "localstorage": "tacticsch-chgmaker-fix-title-storage"},
    {"type": "field","htmlfield": "reftitle", "localstorage": "tacticsch-chgmaker-ref-title-storage"},
    {"type": "field","htmlfield": "cst1title", "localstorage": "tacticsch-chgmaker-cst1-title-storage"},
    {"type": "field","htmlfield": "cst2title", "localstorage": "tacticsch-chgmaker-cst2-title-storage"},
    {"type": "list", "htmlfield": "featurekwhtml", "localstorage": "tacticsch-chgmaker-feature-keywords", "default": defaultfeatlist, "list": 1},
    {"type": "list", "htmlfield": "fixkwhtml", "localstorage": "tacticsch-chgmaker-fix-keywords", "default": defaultfixlist, "list": 2},
    {"type": "list", "htmlfield": "refkwhtml", "localstorage": "tacticsch-chgmaker-ref-keywords", "default": defaultreflist, "list": 3},
    {"type": "list", "htmlfield": "cst1kwhtml", "localstorage": "tacticsch-chgmaker-cst1-keywords", "default": defaultcst1list, "list": 4},
    {"type": "list", "htmlfield": "cst2kwhtml", "localstorage": "tacticsch-chgmaker-cst2-keywords", "default": defaultcst2list, "list": 5},
    {"type": "radio","htmlfield": "yesnobalises", "localstorage": "tacticsch-chgmaker-balises-option"},
    {"type": "radio","htmlfield": "yesnobalisesothers", "localstorage": "tacticsch-chgmaker-balises-other-option"},
    {"type": "radio","htmlfield": "yesnomerges", "localstorage": "tacticsch-chgmaker-merges-option"},
    {"type": "radio","htmlfield": "mdorhtml", "localstorage": "tacticsch-chgmaker-mdhtml-option"}
  ]
  if (pageload) {
    // date and text fields local storage value loading
    fieldsStorage.forEach((item) => getLocalStorage(item.type, item.htmlfield, item.localstorage, item.default, item.list));
    // If user sets parameters in URL, set them.
    urlParamsActions(false);
  } else {
    fieldsStorage.forEach((item) => setLocalStorage(item.type, item.htmlfield, item.localstorage));
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

// Clears changelog ouput
function clearOutput() {
  document.getElementById("bodyhtml").innerHTML = ``
  currentChangelogOutput = "";
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

// Logic for opening collapsible
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

// Clears the date fields
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

  // if url returns 403, alerts user
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
        document.getElementsByName('yesnobalises')[1].checked ? finalList.push(commit.replace(new RegExp(`(?<=\\)\\] - )${quotemeta(balise)} `, 'i'), '')) : finalList.push(commit);
      }
    });
  });
}

function writeSection(list, titlefield, defaulttitle) {
  let formatSection = "";
  if (list.length > 0) {
    document.getElementById(titlefield).value != "" ? formatSection += `## ${document.getElementById(titlefield).value}\n\n` : formatSection += `## ${defaulttitle}\n\n`;
    formatSection += list.join("\n\n");
    formatSection += "\n\n";
  };
  return formatSection;
}

// main app function. sorts all commits received by getCommits() function based on user's options.
async function sortCommits() {
  // Sets loader
  document.getElementById("loader").innerHTML = "<center><img src='./loading.svg'></img></center>";

  let urlField = document.getElementById("urlhtml").value.toString();
  // if is a url converts it to something usable
  urlField.match(new RegExp(`(\\.com\\/)(.*)`, 'i')) && (urlField = urlField.match(new RegExp(`(\\.com\\/)(.*)`, 'i'))[2]);
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
    cst1KwList.length > 0 && baliseRemover(commitMessages, cst1KwList, cst1);
    cst2KwList.length > 0 && baliseRemover(commitMessages, cst2KwList, cst2);

    // eliminated keywords, MUSN'T have one of these in order to get sorted into others
    othersSelectionList = othersSelectionList.concat(featureKwList);
    othersSelectionList = othersSelectionList.concat(fixesKwList);
    othersSelectionList = othersSelectionList.concat(refactorKwList);
    cst1KwList.length > 0 && (othersSelectionList = othersSelectionList.concat(cst1KwList));
    cst2KwList.length > 0 && (othersSelectionList = othersSelectionList.concat(cst2KwList));

    // checks if doesn't matches previous balises and pushes them into a variable
    commitMessages.forEach((commit) => {
      let noMatch = 0;
      othersSelectionList.forEach((balise) => !commit.match(new RegExp(`(?<=\\)\\] - )${quotemeta(balise)} `, 'i')) && noMatch++)
      noMatch === othersSelectionList.length && othersRaw.push(commit);
    })

    // Reset list
    othersSelectionList = [];

    // pushes commits into others, gives the option to ommit merges or to remove the first word of the commit (in most case, the balise)
    othersRaw.forEach((commit) => {
      if (document.getElementsByName('yesnobalisesothers')[0].checked) {
        document.getElementsByName('yesnomerges')[1].checked ? (!commit.match(new RegExp(`(?<=\\)\\] - )[Mm]erge|\\[merge\\]`, 'g')) && others.push(commit)) : others.push(commit);
      } else {
        if (document.getElementsByName('yesnomerges')[1].checked) {
          !commit.match(new RegExp(`(?<=\\)\\] - )[Mm]erge|\\[merge\\]`, "g")) && others.push(commit.replace(new RegExp(`(?<=\\)\\] - )\\[?\\w+[:|\\]]? `, 'i'), ''));
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

    const sectionList = [
      {"list": features, "titlefield": "feattitle", "defaulttitle": "✨ New features"},
      {"list": fixes, "titlefield": "fixtitle", "defaulttitle": "🐛 Bug fixes"},
      {"list": refs, "titlefield": "reftitle", "defaulttitle": "♻️ Code Refactors"},
      {"list": cst1, "titlefield": "cst1title", "defaulttitle": "📘 Custom category 1"},
      {"list": cst2, "titlefield": "cst2title", "defaulttitle": "📙 Custom category 2"},
      {"list": others, "titlefield": "othertitle", "defaulttitle": "📚 Other commits"}
    ]
    const copyOutputButton = '<button onclick="copyToClipboard(true)">📋 Copy MarkDown to clipboard</button>';
    const clearOutputButton = '<button onclick="clearOutput()">🗑 Clear output</button>';

    sectionList.forEach((item) => newBody += writeSection(item.list, item.titlefield, item.defaulttitle));
    document.getElementById("loader").innerHTML = '';
    // either shows the commit in raw markdown, or convert it into HTML
    document.getElementsByName('mdorhtml')[0].checked ? document.getElementById("bodyhtml").innerHTML = `<center>${copyOutputButton} ${clearOutputButton}</center><pre id="md-body">${newBody}</pre>` : document.getElementById("bodyhtml").innerHTML = `<center>${copyOutputButton} ${clearOutputButton}</center>${marked(newBody)}`;
    currentChangelogOutput = newBody;
  }
}

// shows current app version on website
document.addEventListener("DOMContentLoaded", async function (event) {
  const response = await fetch('package.json').then(response => response.json());
  document.getElementById("version").innerHTML = `v${response.version}`
});