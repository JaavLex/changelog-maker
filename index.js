const superagent = require("superagent");

async function GetApiInfo() {
  let { body } = await superagent
      .get('https://api.github.com/repos/GinierClasses/holydraw/commits')
      .set('User-Agent', 'TacticsCH');

      body.forEach(i => console.log("COMMIT : " + i.commit.message + " | BY : " + i.commit.author.name + " | ON : " + i.commit.author.date));
}

GetApiInfo();
