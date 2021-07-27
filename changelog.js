const featureKwList = ['feat:', 'feature:', '[feature]'];
const fixesKwList = ['fix:', 'hotfix:', '[fix]', '[hotfix]', '[HOTFIX]', 'HOTFIX:'];

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

  // console.log(repoUrl+"?page="+i+dateParameters);
  return repoCommits;
}

async function sortCommits() {
  const urlField = document.getElementById("urlhtml").value.toString();
  const nbpageField = document.getElementById("nbpageshtml").value.toString();
  const apiField = document.getElementById("apitoken").value.toString();
  const beforeField = document.getElementById("beforedate").value.toString();
  const afterField = document.getElementById("afterdate").value.toString();

  console.log("YOUHOUUUUUU : " + beforeField + " " + afterField);

  const rawCommits = await getCommits("https://api.github.com/repos/" + urlField + "/commits", apiField, nbpageField, beforeField, afterField);
  console.log(rawCommits);
  const commitMessages = rawCommits.map((item) => item.commit.message + " - [" + item.sha.substring(0, 5) + "](" + item.url + ")");
  const featuresRaw = commitMessages.filter((message) => message.match(/(^.{0,10}(feat))/));
  const fixesRaw = commitMessages.filter((message) => message.match(/(^.{0,10}(fix))/));
  const features = [];
  const fixes = [];

  featuresRaw.forEach((commit) => features.push(commit.replace(featureKwList,'* ')));
  fixesRaw.forEach((commit) => fixes.push(commit.replace(fixesKwList,'* ')));

  let newBody = '<pre><h1># Changelog - ' + urlField + "</h1>";
  newBody += `<h2>## New features</h2>`;
  newBody += features.join("<br><br>");
  newBody += `<h2>## Bug fixes</h2>`;
  newBody += fixes.join("<br><br>");
  document.getElementById("bodyhtml").innerHTML = newBody;
}


