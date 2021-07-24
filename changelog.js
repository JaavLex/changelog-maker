async function getCommits(repoUrl, numberPage) {
  const repoCommits = [];

  for (let i = 1; i < numberPage; i++) {
    const repoContent = await fetch(repoUrl+"?page="+i);
    const jsonCommits = await repoContent.json();
    repoCommits.push(...jsonCommits);
  }

  return repoCommits;
}

async function sortCommits() {
  const rawCommits = await getCommits("https://api.github.com/repos/" + document.getElementById("urlhtml").value.toString() + "/commits", document.getElementById("nbpageshtml").value);
  console.log(rawCommits);
  const commitMessages = rawCommits.map((item) => item.commit.message);
  const featuresRaw = commitMessages.filter((message) => message.match(/(^.{0,10}(feat))/));
  const fixesRaw = commitMessages.filter((message) => message.match(/(^.{0,10}(fix))/));
  const features = [];
  const fixes = [];

  featuresRaw.forEach((commit) => features.push(commit.replace('feat:','* ')));
  fixesRaw.forEach((commit) => fixes.push(commit.replace('fix:','* ')));

  let newBody = '<h1>Changelog</h1>';
  newBody += '<a href="https://github.com/TacticsCH/changelog-maker" >https://github.com/TacticsCH/changelog-maker</a><br>';
  newBody += `<h2>New features</h2>`;
  newBody += features.join("<br><br>");
  newBody += `<h2>Bug fixes</h2>`;
  newBody += fixes.join("<br><br>");
  document.getElementById("bodyhtml").innerHTML = newBody;
}


