const core = require('@actions/core');
const github = require('@actions/github');
const qs = require('querystring')
const fetch = require('node-fetch');

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(JSON.stringify(github.context.payload, null, 2));
    const sender = github.context.payload.sender.login;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const issueNumber = github.context.issue.number;
    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const giphyEndpoint = "https://api.giphy.com/v1/gifs/search";
    const query = {
      api_key: core.getInput("GIPHY_TOKEN"),
      q: "why",
      rating: "g"
    }
    const {data: gifs} = await fetch(
      `${giphyEndpoint}?${qs.stringify(query)}`
    )
    const gifUrl = gifs[0].images.original.url;
    const body = `Hey @${sender}. Why you label me?

    ![](${gifUrl})`;

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
