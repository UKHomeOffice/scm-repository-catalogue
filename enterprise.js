"use strict";

import {Octokit} from "octokit";
import {writeFileSync} from "fs";


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
        total: total_seats_purchased
    };

    console.log("writing results to file");
    writeFileSync("./public/enterprise.json", JSON.stringify(result));
    console.log("done");
})();



