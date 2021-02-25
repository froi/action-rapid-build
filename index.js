const core = require('@actions/core');
const github = require('@actions/github');
const {GiphyFetch} = require('@giphy/js-fetch-api')

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(JSON.stringify(github.context.payload, null, 2));
    const giphySearch = new GiphyFetch(core.getInput("GIPHY_TOKEN"))
    const sender = github.context.payload.sender.login;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const issueNumber = github.context.issue.number;

    const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
    const {data: gifs} = await giphySearch.search('why', {rating: "g"});
    const gif = gifs[0];
    const gifUrl = gif.images.original.url;
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
