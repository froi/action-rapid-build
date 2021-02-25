const core = require('@actions/core');
const github = require('@actions/github');
const qs = require('querystring')
const fetch = require('node-fetch');

// most @actions toolkit packages have async methods
async function run() {
  try {
    const apiKey = process.env.GIPHY_TOKEN;
    core.info(apiKey)
    const sender = github.context.payload.sender.login;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const issueNumber = github.context.issue.number;
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const giphyEndpoint = "https://api.giphy.com/v1/gifs/search";
    const query = {
      api_key: apiKey,
      q: "why",
      rating: "g"
    }
    const url = `${giphyEndpoint}?${qs.stringify(query)}`
    core.info(url);
    const response = await fetch(url)
    core.info(JSON.stringify(response, null, 2))
    const body = `Hey @${sender}. Why you label me?`;

    await octokit.issues.createComment({
      owner,
      repo,
      body,
      issue_number: issueNumber
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
