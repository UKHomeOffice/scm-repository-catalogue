"use strict";

import {Octokit} from "octokit";
import {writeFileSync, readFileSync} from "fs";
import {generateLastUpdated} from "./lastUpdatedAt.js";


const result = {};

(async () => {
    const octokit = new Octokit({auth: process.env.GITHUB_ORG_TOKEN,});

    const {data} = await octokit.request(`GET /orgs/${process.env.GITHUB_ORG_NAME}/installations`);

    const installations = data["installations"];

    let appData = {}
    appData["installations"] = installations.map(item => (
     { app: item.app_slug, installedAt: item.created_at}
    ))

    appData["org"] = installations[0]["account"]["login"]
    appData["total"] = data["total_count"]

    result.organisationApps = {
        organisation: appData["org"],
        installedApps: appData["installations"],
        total: appData["total"] ,
        ...generateLastUpdated(),
    };

    console.log("writing results to file");

    const historicFile = readFileSync('public/organisations.json');
    const historicJson = JSON.parse(historicFile);

    historicJson.organisationApps.values.push(result.organisationApps);

    writeFileSync("./public/organisations.json", JSON.stringify(historicJson, null, 2));


    console.log("done");
})();



