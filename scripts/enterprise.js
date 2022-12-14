"use strict";

const {Octokit} = require("octokit");
const {writeFileSync, readFileSync} = require("fs");
const {generateLastUpdated} = require("./lastUpdatedAt.js");


const result = {};

(async () => {
    const octokit = new Octokit({auth: process.env.GITHUB_ENTERPRISE_BILLING_TOKEN,});

    const {
        data: {
            total_seats_consumed,
            total_seats_purchased
        }
    } = await octokit.request(`GET /enterprises/${process.env.GITHUB_ENTERPRISE_NAME}/consumed-licenses`);

    result.licence = {
        used: total_seats_consumed,
        available: total_seats_purchased - total_seats_consumed,
        total: total_seats_purchased,
        ...generateLastUpdated(),
    };

    console.log("writing results to file");

    const historicFile = readFileSync('./public/enterprise.json');
    const historicJson = JSON.parse(historicFile);

    historicJson.licence.values.push(result.licence);

    writeFileSync("./public/enterprise.json", JSON.stringify(historicJson, null, 2));


    console.log("done");
})();



