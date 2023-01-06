"use strict";

const yaml = require("js-yaml");
const Octokat = require("octokat");
const { Octokit } = require("@octokit/core");
const { throttling } = require("@octokit/plugin-throttling");
const Promise = require("bluebird");
const { writeFileSync } = require("fs");

const ThrottledOctokit = Octokit.plugin(throttling);

(async () => {
  const octo = new Octokat({
    token: process.env.GITHUB_TOKEN,
  });

  const octokit = new ThrottledOctokit({
    auth: process.env.GITHUB_TOKEN,
    throttle: {
      onRateLimit: (retryAfter, options, octokit, retryCount) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );

        if (retryCount < 1) {
          // only retries once
          octokit.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        );
      },
    },
  });

  const formatResult = async (result) => {
    return {
      owner: result.owner.login,
      name: result.name,
      url: result.html.url,
      description: result.description,
      visibility: result.visibility,
      archived: result.archived,
      license: result.license,
      stargazersCount: result.stargazersCount,
      // watchersCount: result.watchersCount, // github api appears to be returning the same as the stargazersCount?!
      language: result.language,
      forksCount: result.forksCount,
      openIssuesCount: result.openIssuesCount,
      updatedAt: result.updatedAt,
      pushedAt: result.pushedAt,
      communityProfile: result.communityProfile,
    };
  };

  const fetchAll = async (org, args) => {
    let response = await octo.orgs(org).repos.fetch({ per_page: 100 });
    let aggregate = [response];

    console.log(`fetched page 1 for ${org}`);
    let i = 1;
    await Promise.delay(50); //slow down to appease github rate limiting
    while (response.nextPage) {
      i++;
      response = await response.nextPage();
      console.log(`fetched page ${i} for ${org}`);
      await Promise.delay(50); //slow down to appease github rate limiting
      aggregate.push(response);
    }
    return aggregate;
  };

  const HomeOfficeOrgs = [].concat(
    ["UKHomeOffice"],
    ["HO-CTO"],
    ["UKHomeOffice-test"],
    ["HMPO"],
    ["Enterprise-functional-tests"],
    ["UKHomeOffice-attic"],
    ["technical-docs"],
    ["HomeOffice-Automation-SSO"],
    ["UKHomeOfficeForms"]
  );

  const appendCommunityProfileInfo = async (input) => {
    const result = {
      ...input,
    };

    try {
      const communityProfile = await octokit.request(
        "GET /repos/{owner}/{repo}/community/profile",
        {
          owner: input.owner.login,
          repo: input.name,
        }
      );

      result["communityProfile"] = communityProfile.data;
    } catch (e) {
      // Ignored - repo does not have communityProfile information
    }

    return result;
  };

  const allReposForAllHomeOfficeOrgs = await Promise.mapSeries(
    HomeOfficeOrgs,
    fetchAll
  );

  const processResults = async (repositories) => {
    const dataWithCommunityScore = await Promise.all(
      repositories.map(appendCommunityProfileInfo)
    );
    const formattedResults = await Promise.all(
      dataWithCommunityScore.map(formatResult)
    );
    return formattedResults;
  };

  const formattedResults = await processResults(
    allReposForAllHomeOfficeOrgs.flat(2)
  );

  console.log("writing results to file");
  writeFileSync("./public/repos.json", JSON.stringify(formattedResults));
  console.log("done");
})();
