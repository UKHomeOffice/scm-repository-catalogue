"use strict";

const {
  Octokit
} = require("octokit");
const {
  writeFileSync,
  readFileSync
} = require("fs");
const {
  generateLastUpdated
} = require("./lastUpdatedAt.js");

async function getOrganisationList() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ORG_TOKEN
  });
  const {
    data
  } = await octokit.request(`GET /user/orgs`);
  return data;
}

async function getAppsList(orgName) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ORG_TOKEN
  });
  const {
    data
  } = await octokit.request(`GET /orgs/${orgName}/installations`);
  return data;
}

async function getPackagesOrg(orgName) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_ORG_TOKEN
  });
  const packageTypes = ["npm", "maven", "rubygems", "docker", "nuget", "container"];
  let packages = [];
  for (let pk of packageTypes) {
    let {
      data
    } = await octokit.request(`GET /orgs/{org}/packages?package_type=${pk}`, {
      org: orgName
    });
    data = data.map(item => {
      return {
        "name": item.name,
        "packageType": item.package_type,
        "visibility": item.visibility,
        "createdAt": item.created_at
      };
    });

    packages.push(data);
  }
  packages = packages.flat();

  let packagesData = {};
  packagesData["organisation"] = orgName;
  packagesData["total"] = packages.length;
  packagesData["packages"] = packages;
  packagesData["lastUpdatedAt"] = generateLastUpdated().lastUpdatedAt;

  return packagesData;
}

async function getPackegesList() {
  let orgs = await getOrganisationList();
  let packageData = [];

  for (let { login } of orgs) {
    packageData.push(await getPackagesOrg(login));
  }


  return packageData;
}

async function getDistinctAppList(appData) {
  let appList = new Set();
  for (let apps of appData) {
    for (let app of apps.installedApps) {
      appList.add(app.app);
    }
  }
  return Array.from(appList);
}

async function getAppColourList(distinctApps) {
  let appsColour = {};
  distinctApps.forEach(function(value) {
    appsColour[value] = stringToColour(value);
  });
  return appsColour;
}

var stringToColour = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

async function getAppsForOrg() {
  let appData = [];
  let org = await getOrganisationList();

  let objectKeys = Object.keys(org);

  for (let key of objectKeys) {
    const dataForOrg = {};
    const apps = await getAppsList(`${org[key].login}`);
    dataForOrg["organisation"] = `${org[key].login}`;
    dataForOrg["total"] = apps.total_count;
    if (apps.total_count > 0) {
      dataForOrg["installedApps"] = apps.installations.map(item => ({
        app: item.app_slug,
        installedAt: item.created_at
      }));
    } else {
      dataForOrg["installedApps"] = [];
    }
    dataForOrg["lastUpdatedAt"] = generateLastUpdated().lastUpdatedAt;
    appData.push(dataForOrg);
  }
  return appData;
}

(async () => {
  const appData = await getAppsForOrg();
  const packagesList = await getPackegesList();

  console.log(packagesList);

  const distinctApps = await getDistinctAppList(appData);
  const appsColour = await getAppColourList(distinctApps);

  console.log("writing results to file");
  let historicFile;
  let historicJson;
  historicFile = readFileSync("./public/organisations.json");
  historicJson = JSON.parse(historicFile);
  historicJson.organisationApps.values = appData;
  writeFileSync("./public/organisations.json", JSON.stringify(historicJson, null, 2));
  historicFile = readFileSync("./public/organisations-packages.json");
  historicJson = JSON.parse(historicFile);
  historicJson.organisationPackages.values = packagesList;
  writeFileSync("./public/organisations-packages.json", JSON.stringify(historicJson, null, 2));
  writeFileSync("./public/apps-colour.json", JSON.stringify(appsColour, null, 2));
  console.log("done");
})();