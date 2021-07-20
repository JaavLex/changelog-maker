const superagent = require("superagent");
const fs = require("fs");

async function GetApiInfo() {
  do {
    pgnumber = 1;
    antpage = true;

    let { body } = await superagent
        .get(`https://api.github.com/repos/GinierClasses/holydraw/commits?per_page=100?page=${pgnumber}`)
        .set('User-Agent', 'TacticsCH');
  
    // body.forEach(i => console.log("COMMIT : " + i.commit.message + " | BY : " + i.commit.author.name + " | ON : " + i.commit.author.date))
    body.forEach(i => fs.writeFileSync('./commits.txt', "COMMIT : " + i.commit.message + " | BY : " + i.commit.author.name + " | ON : " + i.commit.author.date))
    
    let { test } = await superagent
    .get(`https://api.github.com/repos/GinierClasses/holydraw/commits?per_page=100?page=${pgnumber + 1}`)
    .set('User-Agent', 'TacticsCH');

    if (test == null) {
      antpage = true;
      pgnumber++;
    } else {
      antpage = false;
    }
  } while (antpage)
}

GetApiInfo();
