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
  const features = commitMessages.filter((message) => message.match(/(feat)/));
  const fixes = commitMessages.filter((message) => message.match(/(fix)/));

  let newBody = '<h1>Changelog</h1>';
  newBody += '<a href="https://github.com/TacticsCH/changelog-maker" >https://github.com/TacticsCH/changelog-maker</a><br>';
  newBody += `<h2>New features</h2>`;
  newBody += features.join("<br>");
  newBody += `<h2>Bug fixes</h2>`;
  newBody += fixes.join("<br>");
  document.getElementById("bodyhtml").innerHTML = newBody;
}


